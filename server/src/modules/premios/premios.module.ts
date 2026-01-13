import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremioEntidad } from './entities/premio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PremioEntidad])],
  controllers: [],
  providers: [],
})
export class PremiosModule {}
