import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PremiosModule } from './modules/premios/premios.module';
import { PuntosModule } from './modules/puntos/puntos.module';
import { CanjesModule } from './modules/canjes/canjes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user', // El usuario por defecto de tu Docker
      password: 'admin', // IMPORTANTE: Pon la pass que definiste en docker-compose
      database: 'uniformes_db', // O el nombre que creaste en DBeaver (ej: rewards_db)
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo (crea tablas automáticamente)
    }),
    UsuariosModule,
    PremiosModule,
    PuntosModule,
    CanjesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
