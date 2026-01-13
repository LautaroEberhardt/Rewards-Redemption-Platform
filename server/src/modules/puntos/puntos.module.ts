import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionPuntosEntidad } from './entities/transaccion-puntos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransaccionPuntosEntidad])],
  controllers: [],
  providers: [],
})
export class PuntosModule {}
