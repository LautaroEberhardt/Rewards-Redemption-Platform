import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginacionDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Transforma el string del query param a numero
  pagina?: number = 1;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limite?: number = 10;
}