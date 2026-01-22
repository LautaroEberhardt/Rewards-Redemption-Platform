import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioEntidad } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(usuario: UsuarioEntidad) {
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
