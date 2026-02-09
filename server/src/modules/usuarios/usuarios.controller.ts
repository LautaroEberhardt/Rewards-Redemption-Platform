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
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { LoginGoogleDto } from './dtos/login-google.dto';
import { AuthService } from '../auth/auth.service';
import { PaginacionDto } from '../../common/dtos/paginacion.dto';
import { ActualizarUsuarioDto } from './dtos/actualizar-usuario.dto';
import { ActualizarPerfilDto } from './dtos/actualizar-perfil.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../../common/enums/roles.enum';
import { UsuarioEntidad } from './entities/usuario.entity';

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

  // --- Perfil del usuario autenticado (sin restricción de rol) ---

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  obtenerPerfil(@Req() req: { user: UsuarioEntidad }) {
    return req.user;
  }

  @Patch('perfil')
  @UseGuards(JwtAuthGuard)
  actualizarPerfil(
    @Req() req: { user: UsuarioEntidad },
    @Body() actualizarPerfilDto: ActualizarPerfilDto,
  ) {
    return this.usuariosService.actualizar(req.user.id, actualizarPerfilDto);
  }

  // --- Endpoints admin ---

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
