import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(email: string, pass: string): Promise<any> {
    // 1. Buscamos el usuario incluyendo su contraseña encriptada
    const usuario = await this.usuariosService.buscarPorEmailConSecreto(email);

    // 2. Si existe y la contraseña coincide
    if (usuario && (await bcrypt.compare(pass, usuario.contrasena))) {
      // 3. Eliminamos la contraseña del objeto antes de retornarlo
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { contrasena, ...resultado } = usuario;
      return resultado;
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const usuarioValidado = await this.validarUsuario(loginDto.email, loginDto.contrasena);

    if (!usuarioValidado) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Payload del Token (Información pública dentro del JWT)
    const payload = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      sub: usuarioValidado.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      email: usuarioValidado.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      rol: usuarioValidado.rol,
    };

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      access_token: this.jwtService.sign(payload),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      usuario: usuarioValidado,
    };
  }
}
