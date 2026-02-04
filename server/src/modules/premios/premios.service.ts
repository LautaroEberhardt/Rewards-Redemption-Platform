import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PremioEntidad } from './entities/premio.entity';

export type PremioDto = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  costoPuntos: number;
  urlImagen?: string | null;
};

@Injectable()
export class PremiosService {
  constructor(
    @InjectRepository(PremioEntidad)
    private readonly repo: Repository<PremioEntidad>,
  ) {}

  private toDto(entidad: PremioEntidad): PremioDto {
    return {
      id: entidad.id,
      nombre: entidad.nombre,
      descripcion: entidad.descripcion ?? null,
      costoPuntos: entidad.costoEnPuntos,
      urlImagen: entidad.urlImagen ?? null,
    };
  }

  async findAll(): Promise<PremioDto[]> {
    const items = await this.repo.find({ where: { activo: true } });
    return items.map((i) => this.toDto(i));
  }

  async findOne(id: number): Promise<PremioDto> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Premio no encontrado');
    return this.toDto(item);
  }

  async create(input: {
    nombre: string;
    descripcion?: string;
    costoPuntos?: number; // aceptamos costoPuntos
    costo?: number; // y costo para compatibilidad
    urlImagen?: string; // ruta relativa de imagen
  }): Promise<PremioDto> {
    const entidad = this.repo.create({
      nombre: input.nombre,
      // DeepPartial espera undefined para opcionales, no null
      descripcion: input.descripcion ?? undefined,
      urlImagen: input.urlImagen ?? undefined,
      costoEnPuntos:
        typeof input.costoPuntos === 'number'
          ? input.costoPuntos
          : typeof input.costo === 'number'
            ? input.costo
            : 0,
      activo: true,
    });
    const guardado = await this.repo.save(entidad);
    return this.toDto(guardado);
  }

  async update(
    id: number,
    input: {
      nombre?: string;
      descripcion?: string;
      costoPuntos?: number;
      costo?: number;
      urlImagen?: string;
    },
  ): Promise<PremioDto> {
    const existente = await this.repo.findOne({ where: { id } });
    if (!existente) throw new NotFoundException('Premio no encontrado');

    if (typeof input.nombre === 'string') existente.nombre = input.nombre;
    if (typeof input.descripcion === 'string') existente.descripcion = input.descripcion;
    if (typeof input.costoPuntos === 'number') existente.costoEnPuntos = input.costoPuntos;
    else if (typeof input.costo === 'number') existente.costoEnPuntos = input.costo;
    if (typeof input.urlImagen === 'string') existente.urlImagen = input.urlImagen;

    const guardado = await this.repo.save(existente);
    return this.toDto(guardado);
  }

  async remove(id: number): Promise<void> {
    try {
      const resultado = await this.repo.delete(id);
      if (!resultado.affected || resultado.affected < 1) {
        throw new NotFoundException('Premio no encontrado');
      }
    } catch (e) {
      // Fallback de seguridad: si hay restricciones de FK, aplicamos soft delete
      const existente = await this.repo.findOne({ where: { id } });
      if (!existente) throw new NotFoundException('Premio no encontrado');
      existente.activo = false;
      await this.repo.save(existente);
    }
  }
}
