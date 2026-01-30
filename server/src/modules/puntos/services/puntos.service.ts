import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TransaccionPuntosEntidad } from '../entities/transaccion-puntos.entity';
import { UsuarioEntidad } from 'src/modules/usuarios/entities/usuario.entity';
import { AsignarPuntosDto } from '../dtos/asignar-puntos.dto';
import { TipoTransaccion } from '../enums/tipo-transaccion.enum';

@Injectable()
export class PuntosServicio {
  constructor(
    @InjectRepository(TransaccionPuntosEntidad)
    private readonly repositorioTransacciones: Repository<TransaccionPuntosEntidad>,
    @InjectRepository(UsuarioEntidad)
    private readonly repositorioUsuarios: Repository<UsuarioEntidad>,
    private readonly dataSource: DataSource,
  ) {}

  async asignarPuntos(asignarPuntosDto: AsignarPuntosDto): Promise<TransaccionPuntosEntidad> {
    const { usuarioId, cantidad, concepto } = asignarPuntosDto;

    const conceptoFinal = concepto || 'Ajuste Administrativo de Puntos';
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usuario = await queryRunner.manager.findOne(UsuarioEntidad, {
        where: { id: usuarioId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID "${usuarioId}" no encontrado.`);
      }

      // 3. Cálculos de Ledger (Libro Mayor)
      // Nota: Si en el futuro tu DTO permite negativos (restas), esta lógica funciona automáticamente.
      const saldoAnterior = usuario.saldoPuntosActual;
      const saldoNuevo = saldoAnterior + cantidad;

      // Validación: No permitir saldo negativo si es una resta
      if (saldoNuevo < 0) {
        throw new BadRequestException(
          'La operación resultaría en un saldo negativo para el usuario.',
        );
      }

      // 4. Actualizamos el Usuario
      usuario.saldoPuntosActual = saldoNuevo;
      await queryRunner.manager.save(usuario);

      // 5. Creamos la Transacción (Inmutable)
      const nuevaTransaccion = queryRunner.manager.create(TransaccionPuntosEntidad, {
        usuario,
        cantidad: cantidad, // Guardamos el valor con signo (+ o -)
        concepto: conceptoFinal,
        // Determinamos el tipo dinámicamente basado en el signo matemático
        tipo: cantidad >= 0 ? TipoTransaccion.INGRESO : TipoTransaccion.EGRESO,
        saldoAnterior, // Snapshot del estado previo
        saldoNuevo,
        fecha: new Date(),
      });

      await queryRunner.manager.save(nuevaTransaccion);

      await queryRunner.commitTransaction();
      return nuevaTransaccion;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Re-lanzamos errores controlados (404, 400)
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error en transacción de puntos:', error);
      throw new InternalServerErrorException('Error al procesar la asignación de puntos.');
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerSaldoUsuario(usuarioId: string): Promise<{ saldo: number }> {
    const usuario = await this.repositorioUsuarios.findOneBy({ id: usuarioId });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID "${usuarioId}" no encontrado.`);
    }
    return { saldo: usuario.saldoPuntosActual };
  }

  async obtenerHistorial(
    usuarioId: string,
    pagina: number = 1,
    limite: number = 10,
  ): Promise<{
    datos: TransaccionPuntosEntidad[];
    total: number;
    pagina: number;
  }> {
    // Validación básica para evitar offsets negativos
    const paginaReal = pagina > 0 ? pagina : 1;
    const skip = (paginaReal - 1) * limite;

    const [datos, total] = await this.repositorioTransacciones.findAndCount({
      where: { usuario: { id: usuarioId } },
      order: { fecha: 'DESC' },
      take: limite,
      skip: skip,
      // NOTA: No cargamos la relación 'usuario' aquí porque ya sabemos de quién es
    });

    return {
      datos,
      total,
      pagina: paginaReal,
    };
  }
}
