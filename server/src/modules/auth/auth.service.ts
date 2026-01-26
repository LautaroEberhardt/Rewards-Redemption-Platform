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
    const { email, contrasena } = loginDto;

    try {
      // 1. Buscamos al usuario incluyendo el campo contrasena (que está oculto por defecto)
      // Utilizamos el método que definiremos en el UsuariosService
      const usuario = await this.usuariosService.buscarPorEmailConPassword(email);

      // 2. Si el usuario no existe, lanzamos excepción de unauthorized
      if (!usuario) {
        throw new UnauthorizedException('El correo electrónico o la contraseña son incorrectos');
      }

      // 3. Comparamos la contraseña ingresada con el hash almacenado en la DB usando bcrypt

      const esContrasenaValida = await compare(contrasena, usuario.contrasena);

      if (!esContrasenaValida) {
        throw new UnauthorizedException('El correo electrónico o la contraseña son incorrectos');
      }

      return usuario;
    } catch (error) {
      // Si ya es una UnauthorizedException, la relanzamos, si no, lanzamos error genérico
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Error en AuthService:', error);
      throw new UnauthorizedException('Error durante el proceso de validación');
    }
  }

  /**
   * Genera un token JWT para un usuario.
   * @param usuario El usuario para el que se generará el token.
   * @returns Un objeto con el token de acceso.
   */
  async login(usuario: UsuarioEntidad) {
    const payload = { sub: usuario.id, rol: usuario.rol };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
