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
   * Crea un canje: descuenta puntos del usuario y lo agrega a la lista de espera.
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

      // 6. Crear el canje en estado PENDIENTE (lista de espera)
      const canje = queryRunner.manager.create(CanjeEntidad, {
        usuario,
        premio,
        puntosGastados: premio.costoEnPuntos,
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
   * Lista todos los canjes (para administradores), con filtro opcional por estado.
   */
  async listarTodosLosCanjes(estado?: EstadoCanje): Promise<CanjeEntidad[]> {
    const where = estado ? { estado } : {};
    return this.repositorioCanjes.find({
      where,
      relations: ['premio', 'usuario'],
      order: { fechaSolicitud: 'DESC' },
    });
  }

  /**
   * Cambia el estado de un canje (admin). Si se marca como CANCELADO, devuelve los puntos.
   */
  async cambiarEstadoCanje(canjeId: string, nuevoEstado: EstadoCanje): Promise<CanjeEntidad> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const canje = await queryRunner.manager.findOne(CanjeEntidad, {
        where: { id: canjeId },
        relations: ['usuario', 'premio'],
      });

      if (!canje) {
        throw new NotFoundException('Canje no encontrado.');
      }

      // Si se cancela, devolver los puntos al usuario
      if (nuevoEstado === EstadoCanje.CANCELADO && canje.estado !== EstadoCanje.CANCELADO) {
        const usuario = await queryRunner.manager.findOne(UsuarioEntidad, {
          where: { id: canje.usuario.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (usuario) {
          const saldoAnterior = usuario.saldoPuntosActual;
          const saldoNuevo = saldoAnterior + canje.puntosGastados;
          usuario.saldoPuntosActual = saldoNuevo;
          await queryRunner.manager.save(usuario);

          // Registrar la devolución como INGRESO
          const transaccion = queryRunner.manager.create(TransaccionPuntosEntidad, {
            usuario,
            cantidad: canje.puntosGastados,
            concepto: `Devolución por canje cancelado: ${canje.premio?.nombre ?? 'Premio'}`,
            tipo: TipoTransaccion.INGRESO,
            saldoAnterior,
            saldoNuevo,
            fecha: new Date(),
          });
          await queryRunner.manager.save(transaccion);
        }
      }

      canje.estado = nuevoEstado;
      if (nuevoEstado === EstadoCanje.ENTREGADO) {
        canje.fechaEntrega = new Date();
      }
      await queryRunner.manager.save(canje);

      await queryRunner.commitTransaction();
      return canje;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      console.error('Error al cambiar estado del canje:', error);
      throw new InternalServerErrorException('Error al actualizar el estado del canje.');
    } finally {
      await queryRunner.release();
    }
  }
}
