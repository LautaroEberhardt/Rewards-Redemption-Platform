import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { LoginGoogleDto } from './dtos/login-google.dto';

@Controller('usuarios')
@UseInterceptors(ClassSerializerInterceptor)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  registrarUsuario(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuariosService.crear(crearUsuarioDto);
  }

  @Post('login-google')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(@Body() loginGoogleDto: LoginGoogleDto) {
    const usuario = await this.usuariosService.validarORegistrarUsuarioGoogle(loginGoogleDto);
    return {
      message: 'Autenticación exitosa',
      usuario,
    };
  }
}
