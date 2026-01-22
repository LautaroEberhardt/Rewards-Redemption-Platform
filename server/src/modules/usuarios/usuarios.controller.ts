import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { LoginGoogleDto } from './dtos/login-google.dto';
import { AuthService } from '../auth/auth.service';

@Controller('usuarios')
@UseInterceptors(ClassSerializerInterceptor)
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly authService: AuthService,
  ) {}

  @Post('registro')
  registrarUsuario(@Body() crearUsuarioDto: CrearUsuarioDto) {
    return this.usuariosService.crear(crearUsuarioDto);
  }

  @Post('login-google')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(@Body() loginGoogleDto: LoginGoogleDto) {
    const usuario = await this.usuariosService.validarORegistrarUsuarioGoogle(loginGoogleDto);
    const access_token = this.authService.login(usuario);

    return {
      message: 'Autenticación exitosa',
      usuario,
      token: access_token,
    };
  }
}
