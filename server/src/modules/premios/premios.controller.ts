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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../../common/enums/roles.enum';

@Controller('premios')
export class PremiosController {
  constructor(private readonly service: PremiosService) {}

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
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadsPath = './uploads/premios';
          if (!existsSync(uploadsPath)) {
            mkdirSync(uploadsPath, { recursive: true });
          }
          cb(null, uploadsPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `premio-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body()
    body: {
      nombre: string;
      descripcion?: string;
      costoPuntos?: number;
      costo?: number;
      titulo?: string; // compatibilidad: si llega 'titulo', lo usamos como nombre
    },
    // Tipo estricto provisto por @types/multer
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<PremioDto> {
    // Tolerante: si body llega undefined (multipart mal parseado), usamos valores seguros
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
    const normalized = {
      nombre,
      descripcion,
      costoPuntos,
      costo,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      urlImagen: archivo?.filename ? `/uploads/premios/${archivo.filename}` : undefined,
    };
    return this.service.create(normalized);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadsPath = './uploads/premios';
          if (!existsSync(uploadsPath)) {
            mkdirSync(uploadsPath, { recursive: true });
          }
          cb(null, uploadsPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `premio-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
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
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<PremioDto> {
    const costoPuntosRaw = body?.costoPuntos as unknown;
    const costoRaw = body?.costo as unknown;
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
      urlImagen: archivo?.filename ? `/uploads/premios/${archivo.filename}` : undefined,
    };
    return this.service.update(id, normalized);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadsPath = './uploads/premios';
          if (!existsSync(uploadsPath)) {
            mkdirSync(uploadsPath, { recursive: true });
          }
          cb(null, uploadsPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `premio-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
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
    @UploadedFile() archivo?: Express.Multer.File,
  ): Promise<PremioDto> {
    const costoPuntosRaw = body?.costoPuntos as unknown;
    const costoRaw = body?.costo as unknown;
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
      urlImagen: archivo?.filename ? `/uploads/premios/${archivo.filename}` : undefined,
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
