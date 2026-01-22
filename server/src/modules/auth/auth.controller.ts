import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Retornar 200 en lugar de 201 por defecto
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
