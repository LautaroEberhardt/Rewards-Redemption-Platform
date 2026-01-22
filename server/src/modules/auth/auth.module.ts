import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Authcontroller } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module'; // Importar el módulo

@Module({
  imports: [
    // 1. Importamos UsuariosModule para poder usar UsuariosService
    UsuariosModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configuración asíncrona de JWT para leer variables de entorno
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secreto_super_seguro',
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ConfigModule,
  ],
  controllers: [Authcontroller],
  providers: [AuthService, JwtStrategy], // JwtStrategy debe estar aquí
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
