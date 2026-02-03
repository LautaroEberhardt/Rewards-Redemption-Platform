import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PremiosService, PremioDto } from './premios.service';

@Controller('premios')
export class PremiosController {
  constructor(private readonly service: PremiosService) {}

  @Get()
  findAll(): Promise<PremioDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PremioDto> {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      nombre: string;
      descripcion?: string;
      costoPuntos?: number;
      costo?: number;
      titulo?: string; // compatibilidad: si llega 'titulo', lo usamos como nombre
    },
  ): Promise<PremioDto> {
    const normalized = {
      nombre: body.nombre ?? body.titulo ?? '',
      descripcion: body.descripcion,
      costoPuntos: body.costoPuntos,
      costo: body.costo,
    };
    return this.service.create(normalized);
  }

  @Patch(':id')
  patch(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      nombre?: string;
      descripcion?: string;
      costoPuntos?: number;
      costo?: number;
      titulo?: string;
    },
  ): Promise<PremioDto> {
    const normalized = {
      nombre: body.nombre ?? body.titulo,
      descripcion: body.descripcion,
      costoPuntos: body.costoPuntos,
      costo: body.costo,
    };
    return this.service.update(id, normalized);
  }

  @Put(':id')
  put(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      nombre?: string;
      descripcion?: string;
      costoPuntos?: number;
      costo?: number;
      titulo?: string;
    },
  ): Promise<PremioDto> {
    const normalized = {
      nombre: body.nombre ?? body.titulo,
      descripcion: body.descripcion,
      costoPuntos: body.costoPuntos,
      costo: body.costo,
    };
    return this.service.update(id, normalized);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
