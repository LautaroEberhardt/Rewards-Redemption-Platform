import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CanjesServicio } from '../services/canjes.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolUsuario } from '../../../common/enums/roles.enum';
import { CrearCanjeDto } from '../dtos/crear-canje.dto';
import { EstadoCanje } from '../enums/estado-canje.enum';

@Controller('canjes')
@UseGuards(JwtAuthGuard)
export class CanjesControlador {
  constructor(private readonly canjesServicio: CanjesServicio) {}

  /**
   * POST /canjes — Crea un canje de premio para el usuario autenticado.
   * El canje queda en estado PENDIENTE hasta que el admin lo complete.
   * Solo los clientes pueden canjear premios.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.CLIENTE)
  @HttpCode(HttpStatus.CREATED)
  async crearCanje(@Body() crearCanjeDto: CrearCanjeDto, @Request() req: { user: { id: string } }) {
    const canje = await this.canjesServicio.crearCanje(req.user.id, crearCanjeDto.premioId);

    return {
      mensaje: '¡Canje solicitado con éxito! Queda pendiente de entrega.',
      canje: {
        id: canje.id,
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
      estado: c.estado,
      puntosGastados: c.puntosGastados,
      fechaSolicitud: c.fechaSolicitud,
      fechaEntrega: c.fechaEntrega,
      premio: c.premio
        ? {
            id: c.premio.id,
            nombre: c.premio.nombre,
            imagenUrl: c.premio.urlImagen,
          }
        : null,
    }));
  }

  /**
   * GET /canjes/admin — Lista todos los canjes para el admin, con filtro opcional por estado.
   */
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMIN)
  async listarTodosLosCanjes(@Query('estado') estado?: EstadoCanje) {
    const canjes = await this.canjesServicio.listarTodosLosCanjes(estado);
    return canjes.map((c) => ({
      id: c.id,
      estado: c.estado,
      puntosGastados: c.puntosGastados,
      fechaSolicitud: c.fechaSolicitud,
      fechaEntrega: c.fechaEntrega,
      usuario: c.usuario
        ? {
            id: c.usuario.id,
            nombre: c.usuario.nombreCompleto,
            correo: c.usuario.correo,
          }
        : null,
      premio: c.premio
        ? {
            id: c.premio.id,
            nombre: c.premio.nombre,
            imagenUrl: c.premio.urlImagen,
          }
        : null,
    }));
  }

  /**
   * PATCH /canjes/:id/estado — Cambia el estado de un canje (solo admin).
   */
  @Patch(':id/estado')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMIN)
  async cambiarEstadoCanje(@Param('id') id: string, @Body() body: { estado: EstadoCanje }) {
    const canje = await this.canjesServicio.cambiarEstadoCanje(id, body.estado);
    return {
      mensaje: `Estado del canje actualizado a ${canje.estado}.`,
      canje: {
        id: canje.id,
        estado: canje.estado,
        puntosGastados: canje.puntosGastados,
        fechaSolicitud: canje.fechaSolicitud,
        fechaEntrega: canje.fechaEntrega,
      },
    };
  }
}
