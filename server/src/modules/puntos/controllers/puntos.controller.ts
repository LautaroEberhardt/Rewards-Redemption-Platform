// server/src/modules/puntos/puntos.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PuntosServicio } from '../services/puntos.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolUsuario } from 'src/common/enums/roles.enum';
import { AsignarPuntosDto } from '../dtos/asignar-puntos.dto';

@Controller('puntos')
@UseGuards(JwtAuthGuard, RolesGuard) // Autenticación + roles a nivel de controlador
export class PuntosController {
  constructor(private readonly puntosServicio: PuntosServicio) {}

  /**
   * ACCIÓN: Asignar puntos a un cliente.
   * RESTRICCIÓN: Solo el ADMIN (Gerente) puede realizar esta acción.
   */
  @Post('asignar')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async asignarPuntos(@Body() datosAsignacion: AsignarPuntosDto) {
    // eslint-disable-next-line no-useless-catch
    try {
      // La lógica compleja se delega al servicio siguiendo Clean Architecture
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return await this.puntosServicio.asignarPuntos(datosAsignacion);
    } catch (error) {
      // El Exception Filter de NestJS manejará los errores inesperados
      throw error;
    }
  }

  /**
   * ACCIÓN: Consultar el saldo actual del usuario autenticado.
   * RESTRICCIÓN: Disponible para CLIENTE y ADMIN.
   */
  @Get('mi-saldo')
  @Roles(RolUsuario.CLIENTE, RolUsuario.ADMIN)
  async obtenerMiSaldo(@Request() req) {
    // Obtenemos el ID del usuario directamente desde el objeto de petición (JWT)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const usuarioId = req.user.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const saldo = await this.puntosServicio.obtenerSaldoUsuario(usuarioId);
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      usuarioId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      saldoPuntosActual: saldo,
    };
  }

  /**
   * ACCIÓN: Ver historial de transacciones.
   */
  @Get('historial')
  @Roles(RolUsuario.CLIENTE, RolUsuario.ADMIN)
  async obtenerHistorial(
    @Request() req,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    const pag = pagina ? parseInt(pagina, 10) : 1;
    const lim = limite ? parseInt(limite, 10) : 20;
    return await this.puntosServicio.obtenerHistorial(req.user.id, pag, lim);
  }
}
