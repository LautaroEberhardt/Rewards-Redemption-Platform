import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    // eslint-disable-next-line no-useless-catch
    try {
      const usuario = await this.authService.validarUsuario(loginDto);
      return this.authService.login(usuario); // Devolver el token
    } catch (error) {
      throw error;
    }
  }
}
