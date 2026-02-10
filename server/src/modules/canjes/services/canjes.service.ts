import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CanjeEntidad } from '../entities/canje.entity';
import { UsuarioEntidad } from '../../usuarios/entities/usuario.entity';
import { PremioEntidad } from '../../premios/entities/premio.entity';
import { TransaccionPuntosEntidad } from '../../puntos/entities/transaccion-puntos.entity';
import { TipoTransaccion } from '../../puntos/enums/tipo-transaccion.enum';
import { EstadoCanje } from '../enums/estado-canje.enum';

@Injectable()
export class CanjesServicio {
  constructor(
    @InjectRepository(CanjeEntidad)
    private readonly repositorioCanjes: Repository<CanjeEntidad>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crea un canje: descuenta puntos del usuario y genera un código de verificación.
   * Usa una transacción para garantizar atomicidad.
   */
  async crearCanje(usuarioId: string, premioId: number): Promise<CanjeEntidad> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Obtener usuario con lock pesimista
      const usuario = await queryRunner.manager.findOne(UsuarioEntidad, {
        where: { id: usuarioId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado.');
      }

      // 2. Obtener premio
      const premio = await queryRunner.manager.findOne(PremioEntidad, {
        where: { id: premioId, activo: true },
      });

      if (!premio) {
        throw new NotFoundException('Premio no encontrado o no está disponible.');
      }

      // 3. Validar saldo suficiente
      if (usuario.saldoPuntosActual < premio.costoEnPuntos) {
        throw new BadRequestException(
          `Puntos insuficientes. Necesitás ${premio.costoEnPuntos} pts y tenés ${usuario.saldoPuntosActual} pts.`,
        );
      }

      // 4. Descontar puntos
      const saldoAnterior = usuario.saldoPuntosActual;
      const saldoNuevo = saldoAnterior - premio.costoEnPuntos;
      usuario.saldoPuntosActual = saldoNuevo;
      await queryRunner.manager.save(usuario);

      // 5. Registrar transacción de puntos (EGRESO)
      const transaccion = queryRunner.manager.create(TransaccionPuntosEntidad, {
        usuario,
        cantidad: -premio.costoEnPuntos,
        concepto: `Canje de premio: ${premio.nombre}`,
        tipo: TipoTransaccion.EGRESO,
        saldoAnterior,
        saldoNuevo,
        fecha: new Date(),
      });
      await queryRunner.manager.save(transaccion);

      // 6. Crear el canje con código de verificación único
      const codigoVerificacion = this.generarCodigoVerificacion();

      const canje = queryRunner.manager.create(CanjeEntidad, {
        usuario,
        premio,
        puntosGastados: premio.costoEnPuntos,
        codigoVerificacion,
        estado: EstadoCanje.PENDIENTE,
      });
      await queryRunner.manager.save(canje);

      await queryRunner.commitTransaction();

      return canje;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error al crear canje:', error);
      throw new InternalServerErrorException('Error al procesar el canje.');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtiene los canjes de un usuario específico.
   */
  async obtenerCanjesDeUsuario(usuarioId: string): Promise<CanjeEntidad[]> {
    return this.repositorioCanjes.find({
      where: { usuario: { id: usuarioId } },
      relations: ['premio'],
      order: { fechaSolicitud: 'DESC' },
    });
  }

  /**
   * Genera un código de verificación alfanumérico corto (ej: "A3X-7K").
   */
  private generarCodigoVerificacion(): string {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const parte1 = Array.from({ length: 3 }, () =>
      caracteres.charAt(Math.floor(Math.random() * caracteres.length)),
    ).join('');
    const parte2 = Array.from({ length: 2 }, () =>
      caracteres.charAt(Math.floor(Math.random() * caracteres.length)),
    ).join('');
    return `${parte1}-${parte2}`;
  }
}
