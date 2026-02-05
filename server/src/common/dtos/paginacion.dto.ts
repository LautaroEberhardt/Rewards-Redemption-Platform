import { IsOptional, IsPositive, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginacionDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  pagina?: number = 1;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limite?: number = 10;

  @IsOptional()
  @IsString()
  busqueda?: string; // Nuevo campo para el término de búsqueda
}
