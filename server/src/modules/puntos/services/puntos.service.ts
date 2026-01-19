import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransaccionPuntosEntidad } from '../entities/transaccion-puntos.entity';

@Injectable()
export class PuntosServicio {
  constructor(
    @InjectRepository(TransaccionPuntosEntidad)
    private readonly repositorioTransacciones: Repository<TransaccionPuntosEntidad>,
  ) {}

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
  ): Promise<{ datos: TransaccionPuntosEntidad[]; total: number; pagina: number }> {
    
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