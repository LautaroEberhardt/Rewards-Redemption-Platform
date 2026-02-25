// server/src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { compare } from 'bcrypt'; // Importación de la librería bcrypt
import { LoginDto } from './dtos/login.dto';
import { UsuarioEntidad } from '../usuarios/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales del usuario y verifica su existencia.
   * @param loginDto Datos de acceso (email y contrasena).
   * @returns El usuario validado con su respectivo rol.
   */
  async validarUsuario(loginDto: LoginDto): Promise<UsuarioEntidad> {
    const { correo, contrasena } = loginDto;

    try {
      const usuario = await this.usuariosService.buscarPorEmailConPassword(correo);

      if (!usuario) {
        throw new UnauthorizedException('El correo electrónico o la contraseña son incorrectos');
      }

      if (!usuario.contrasena) {
        throw new UnauthorizedException(
          'Esta cuenta usa Google. Por favor inicia sesión con ese método.',
        );
      }

      const esContrasenaValida = await compare(contrasena, usuario.contrasena);

      if (!esContrasenaValida) {
        throw new UnauthorizedException('El correo electrónico o la contraseña son incorrectos');
      }

      return usuario;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Error en AuthService:', error);
      throw new UnauthorizedException('Error durante el proceso de validación');
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async login(usuario: UsuarioEntidad) {
    const payload = { sub: usuario.id, rol: usuario.rol };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena, ...usuarioSinContrasena } = usuario;

    return {
      access_token: this.jwtService.sign(payload),
      usuario: usuarioSinContrasena,
    };
  }
}
