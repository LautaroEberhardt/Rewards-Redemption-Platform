import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    // NestJS se encarga automáticamente de atrapar cualquier error
    // que ocurra aquí adentro y enviarlo al cliente.
    const usuario = await this.authService.validarUsuario(loginDto);
    return this.authService.login(usuario);
  }
}
