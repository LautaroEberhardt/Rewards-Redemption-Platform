import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Asegúrate que ConfigModule esté aquí
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule, // <--- AÑADE ESTA LÍNEA
    forwardRef(() => UsuariosModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Para depurar, vamos a ver qué está leyendo
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret: secret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // No necesitas JwtService aquí, ya lo provee JwtModule
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
