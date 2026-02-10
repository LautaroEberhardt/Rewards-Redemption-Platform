import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CanjesServicio } from '../services/canjes.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CrearCanjeDto } from '../dtos/crear-canje.dto';

@Controller('canjes')
@UseGuards(JwtAuthGuard)
export class CanjesControlador {
  constructor(private readonly canjesServicio: CanjesServicio) {}

  /**
   * POST /canjes — Crea un canje de premio para el usuario autenticado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crearCanje(@Body() crearCanjeDto: CrearCanjeDto, @Request() req: { user: { id: string } }) {
    const canje = await this.canjesServicio.crearCanje(req.user.id, crearCanjeDto.premioId);

    return {
      mensaje: '¡Canje realizado con éxito!',
      canje: {
        id: canje.id,
        codigoVerificacion: canje.codigoVerificacion,
        estado: canje.estado,
        puntosGastados: canje.puntosGastados,
        fechaSolicitud: canje.fechaSolicitud,
      },
    };
  }

  /**
   * GET /canjes/mis-canjes — Lista los canjes del usuario autenticado.
   */
  @Get('mis-canjes')
  async obtenerMisCanjes(@Request() req: { user: { id: string } }) {
    const canjes = await this.canjesServicio.obtenerCanjesDeUsuario(req.user.id);
    return canjes.map((c) => ({
      id: c.id,
      codigoVerificacion: c.codigoVerificacion,
      estado: c.estado,
      puntosGastados: c.puntosGastados,
      fechaSolicitud: c.fechaSolicitud,
      premio: c.premio
        ? {
            id: c.premio.id,
            nombre: c.premio.nombre,
            imagenUrl: c.premio.urlImagen,
          }
        : null,
    }));
  }
}
