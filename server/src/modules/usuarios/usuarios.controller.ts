import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { LoginGoogleDto } from './dtos/login-google.dto';
import { AuthService } from '../auth/auth.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../../common/enums/roles.enum';

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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  findAll() {
    return this.usuariosService.findAll();
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
