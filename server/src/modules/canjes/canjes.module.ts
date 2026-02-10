import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanjeEntidad } from './entities/canje.entity';
import { CanjesServicio } from './services/canjes.service';
import { CanjesControlador } from './controllers/canjes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CanjeEntidad])],
  controllers: [CanjesControlador],
  providers: [CanjesServicio],
  exports: [CanjesServicio],
})
export class CanjesModule {}
