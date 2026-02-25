import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PremiosModule } from './modules/premios/premios.module';
import { PuntosModule } from './modules/puntos/puntos.module';
import { CanjesModule } from './modules/canjes/canjes.module';
import { UsuarioEntidad } from './modules/usuarios/entities/usuario.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RecuperacionModule } from './modules/usuarios/recuperacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Servir archivos estáticos desde /uploads
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'uniformes_db',
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo (crea tablas automáticamente)
    }),
    TypeOrmModule.forFeature([UsuarioEntidad]),
    UsuariosModule,
    PremiosModule,
    PuntosModule,
    CanjesModule,
    AuthModule,
    RecuperacionModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
