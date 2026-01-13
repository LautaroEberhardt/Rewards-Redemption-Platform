import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanjeEntidad } from './entities/canje.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CanjeEntidad])],
  controllers: [],
  providers: [],
})
export class CanjesModule {}
