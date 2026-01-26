import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionPuntosEntidad } from './entities/transaccion-puntos.entity';
import { PuntosServicio } from './services/puntos.service';
import { UsuarioEntidad } from '../usuarios/entities/usuario.entity';
import { PuntosController } from './controllers/puntos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransaccionPuntosEntidad,
      UsuarioEntidad, // 2. Registrar UsuarioEntidad aquí
    ]),
  ],
  controllers: [PuntosController], // 3. Añadir el controlador
  providers: [PuntosServicio],
  exports: [PuntosServicio],
})
export class PuntosModule {}
