import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremioEntidad } from './entities/premio.entity';
import { PremiosService } from './premios.service';
import { PremiosController } from './premios.controller';
import { CloudinaryProvider } from '../../config/cloudinary.config';
import { CloudinaryService } from '../../common/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([PremioEntidad])],
  controllers: [PremiosController],
  providers: [PremiosService, CloudinaryProvider, CloudinaryService],
})
export class PremiosModule {}
