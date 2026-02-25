import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecuperacionContrasenaServicio } from './recuperacion.servicio';
import { RecuperacionContrasenaControlador } from './recuperacion.controlador';
import { UsuarioEntidad } from './usuario.entidad';
import { TokenRecuperacionEntidad } from './token-recuperacion.entidad';
import { AdaptadorCorreoGmail } from '../../common/adaptadores/adaptador-correo';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntidad, TokenRecuperacionEntidad])],
  controllers: [RecuperacionContrasenaControlador],
  providers: [
    RecuperacionContrasenaServicio,
    {
      provide: 'AdaptadorCorreo',
      useClass: AdaptadorCorreoGmail,
    },
  ],
})
export class RecuperacionModule {}
