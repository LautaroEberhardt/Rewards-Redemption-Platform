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
  Query,
  Patch,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { LoginGoogleDto } from './dtos/login-google.dto';
import { AuthService } from '../auth/auth.service';
import { PaginacionDto } from '../../common/dtos/paginacion.dto';
import { ActualizarUsuarioDto } from './dtos/actualizar-usuario.dto';

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
  obtenerUsuarios(@Query(new ValidationPipe({ transform: true })) paginacionDto: PaginacionDto) {
    return this.usuariosService.obtenerTodosPaginados(paginacionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMIN)
  actualizarUsuario(@Param('id') id: string, @Body() actualizarUsuarioDto: ActualizarUsuarioDto) {
    return this.usuariosService.actualizar(id, actualizarUsuarioDto);
  }

  @Post('login-google')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(@Body() loginGoogleDto: LoginGoogleDto) {
    const usuario = await this.usuariosService.validarORegistrarUsuarioGoogle(loginGoogleDto);
    const access_token = await this.authService.login(usuario);

    return {
      message: 'Autenticación exitosa',
      usuario,
      token: access_token,
    };
  }
}
