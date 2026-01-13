import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntidad } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntidad])], // <--- ESTO registra la entidad
  controllers: [], // Los pondremos luego
  providers: [], // Los pondremos luego
  exports: [TypeOrmModule], // Para que otros módulos puedan usar el repositorio de usuarios
})
export class UsuariosModule {}
