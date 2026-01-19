import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionPuntosEntidad } from './entities/transaccion-puntos.entity';
import { PuntosServicio } from './services/puntos.service'; // <--- IMPORTAR

@Module({
  imports: [TypeOrmModule.forFeature([TransaccionPuntosEntidad])],
  controllers: [], // Aquí iría tu PuntosController
  providers: [PuntosServicio], // <--- REGISTRAR EL SERVICIO AQUÍ
  exports: [PuntosServicio], // <--- EXPORTAR si lo vas a usar en UsuariosModule
})
export class PuntosModule {}
