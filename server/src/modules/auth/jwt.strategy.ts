import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RolUsuario } from 'src/common/enums/roles.enum';
import { UsuariosService } from '../usuarios/usuarios.service';

// 2. Definir una interfaz para el payload del token
export interface JwtPayload {
  sub: string;
  email: string;
  rol: RolUsuario;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // 3. Inyectar dependencias de forma estándar
    private readonly configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  // 4. Usar el payload tipado y validar contra la base de datos
  async validate(payload: JwtPayload) {
    const usuario = await this.usuariosService.buscarPorId(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException('Token no válido o el usuario ha sido eliminado.');
    }

    // Lo que se retorna aquí se adjunta a `request.user`
    return usuario;
  }
}
