import { Controller, Post, Body } from '@nestjs/common';
import { RecuperacionContrasenaServicio } from './recuperacion.servicio';
import { SolicitarRecuperacionDto, RestablecerContrasenaDto } from './recuperacion.dto';

@Controller('recuperar-contrasena')
export class RecuperacionContrasenaControlador {
  constructor(private readonly servicio: RecuperacionContrasenaServicio) {}

  @Post('solicitar')
  async solicitar(@Body() dto: SolicitarRecuperacionDto): Promise<{ mensaje: string }> {
    await this.servicio.solicitarRecuperacion(dto);
    return {
      mensaje: 'Si el correo existe, se enviaron instrucciones para reestablecer la contraseña.',
    };
  }

  @Post('restablecer')
  async restablecer(@Body() dto: RestablecerContrasenaDto): Promise<{ mensaje: string }> {
    await this.servicio.restablecerContrasena(dto);
    return { mensaje: 'Contraseña reestablecida correctamente.' };
  }
}
