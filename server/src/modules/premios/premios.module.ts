import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremioEntidad } from './entities/premio.entity';
import { PremiosService } from './premios.service';
import { PremiosController } from './premios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PremioEntidad])],
  controllers: [PremiosController],
  providers: [PremiosService],
})
export class PremiosModule {}
