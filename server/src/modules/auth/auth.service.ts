// server/src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { compare } from 'bcrypt'; // Importación de la librería bcrypt
import { LoginDto } from './dtos/login.dto';
import { UsuarioEntidad } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
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
}
