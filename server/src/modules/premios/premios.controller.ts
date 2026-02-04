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
} from '@nestjs/common';
import { PremiosService, PremioDto } from './premios.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

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
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
