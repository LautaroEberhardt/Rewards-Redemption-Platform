import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    // Inyectamos el repositorio de Usuarios
    @InjectRepository(UsuarioEntidad)
    private readonly repositorioUsuarios: Repository<UsuarioEntidad>,

    // Inyectamos el DataSource para manejar transacciones
    private readonly dataSource: DataSource,
  ) {}

  async asignarPuntos(asignarPuntosDto: AsignarPuntosDto): Promise<TransaccionPuntosEntidad> {
    const { usuarioId, cantidad, concepto } = asignarPuntosDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usuario = await queryRunner.manager.findOneBy(UsuarioEntidad, { id: usuarioId });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID "${usuarioId}" no encontrado.`);
      }

      // Actualizamos el saldo del usuario
      usuario.saldoPuntosActual += cantidad;
      await queryRunner.manager.save(usuario);

      // Creamos el registro de la transacción
      const nuevaTransaccion = queryRunner.manager.create(TransaccionPuntosEntidad, {
        usuario,
        cantidad,
        concepto,
        tipo: cantidad > 0 ? TipoTransaccion.INGRESO : TipoTransaccion.EGRESO,
        saldoAnterior: usuario.saldoPuntosActual - cantidad,
        saldoNuevo: usuario.saldoPuntosActual,
      });

      await queryRunner.manager.save(nuevaTransaccion);

      await queryRunner.commitTransaction();
      return nuevaTransaccion;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al asignar los puntos.');
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

  /**
   * Obtiene el historial paginado para evitar saturar la RAM.
   * @param usuarioId ID del usuario a consultar
   * @param pagina Número de página (default 1)
   * @param limite Registros por página (default 10)
   */
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
      order: { fecha: 'DESC' }, // Lo más reciente primero
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
