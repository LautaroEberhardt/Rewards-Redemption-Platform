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
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { PremiosService, PremioDto } from './premios.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../../common/enums/roles.enum';
import { CloudinaryService } from '../../common/cloudinary.service';

@Controller('premios')
export class PremiosController {
  constructor(
    private readonly service: PremiosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll(): Promise<PremioDto[]> {
    return this.service.findAll();
  }

  /** Lista todos los premios incluyendo los deshabilitados (solo admin) */
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  findAllAdmin(): Promise<PremioDto[]> {
    return this.service.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PremioDto> {
    return this.service.findOne(id);
  }

  /** Habilita o deshabilita un premio */
  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { activo: boolean },
  ): Promise<PremioDto> {
    return this.service.cambiarEstado(id, body.activo);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body()
    body: {
      nombre: string;
      descripcion?: string;
      costoPuntos?: number;
      costo?: number;
      titulo?: string;
    },
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<PremioDto> {
    const nombre = body?.nombre ?? body?.titulo ?? '';
    const descripcion = body?.descripcion;
    const costoPuntosRaw = body?.costoPuntos as unknown;
    const costoRaw = body?.costo as unknown;
    const costoPuntos =
      typeof costoPuntosRaw === 'string'
        ? Number(costoPuntosRaw)
        : typeof costoPuntosRaw === 'number'
          ? costoPuntosRaw
          : undefined;
    const costo =
      typeof costoRaw === 'string'
        ? Number(costoRaw)
        : typeof costoRaw === 'number'
          ? costoRaw
          : undefined;

    let urlImagen: string | undefined;
    if (archivo) {
      const resultado = await this.cloudinaryService.uploadFile(archivo);
      urlImagen = resultado.secure_url;
    }

    const normalized = {
      nombre,
      descripcion,
      costoPuntos,
      costo,
      urlImagen,
    };
    return this.service.create(normalized);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      nombre?: string;
      descripcion?: string;
      costoPuntos?: number;
      costo?: number;
      titulo?: string;
    },
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<PremioDto> {
    const costoPuntosRaw = body?.costoPuntos as unknown;
    const costoRaw = body?.costo as unknown;

    let urlImagen: string | undefined;
    if (archivo) {
      const resultado = await this.cloudinaryService.uploadFile(archivo);
      urlImagen = resultado.secure_url;
    }

    const normalized = {
      nombre: body?.nombre ?? body?.titulo,
      descripcion: body?.descripcion,
      costoPuntos:
        typeof costoPuntosRaw === 'string'
          ? Number(costoPuntosRaw)
          : typeof costoPuntosRaw === 'number'
            ? costoPuntosRaw
            : undefined,
      costo:
        typeof costoRaw === 'string'
          ? Number(costoRaw)
          : typeof costoRaw === 'number'
            ? costoRaw
            : undefined,
      urlImagen,
    };
    return this.service.update(id, normalized);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      nombre?: string;
      descripcion?: string;
      costoPuntos?: number;
      costo?: number;
      titulo?: string;
    },
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<PremioDto> {
    const costoPuntosRaw = body?.costoPuntos as unknown;
    const costoRaw = body?.costo as unknown;

    let urlImagen: string | undefined;
    if (archivo) {
      const resultado = await this.cloudinaryService.uploadFile(archivo);
      urlImagen = resultado.secure_url;
    }

    const normalized = {
      nombre: body?.nombre ?? body?.titulo,
      descripcion: body?.descripcion,
      costoPuntos:
        typeof costoPuntosRaw === 'string'
          ? Number(costoPuntosRaw)
          : typeof costoPuntosRaw === 'number'
            ? costoPuntosRaw
            : undefined,
      costo:
        typeof costoRaw === 'string'
          ? Number(costoRaw)
          : typeof costoRaw === 'number'
            ? costoRaw
            : undefined,
      urlImagen,
    };
    return this.service.update(id, normalized);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ mensaje: string }> {
    return this.service.remove(id);
  }
}
