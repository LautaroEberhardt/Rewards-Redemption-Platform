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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RecuperacionModule } from './modules/usuarios/recuperacion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env', //sacar despues
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // AQUÍ ESTÁ LA CORRECCIÓN: Le pedimos el nombre de la variable
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        // REGLA DE ARQUITECTO: En tests, synchronize puede ser true
        // para que las tablas se creen solas en la DB de prueba vacía.
        synchronize: process.env.NODE_ENV === 'test',
        dropSchema: process.env.NODE_ENV === 'test',
      }),
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
