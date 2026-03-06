import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      migrations: [__dirname + '/migrations/*.{ts,js}'],
      migrationsRun: process.env.NODE_ENV === 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
