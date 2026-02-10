import { IsInt, IsPositive } from 'class-validator';

export class CrearCanjeDto {
  @IsInt({ message: 'El ID del premio debe ser un número entero.' })
  @IsPositive({ message: 'El ID del premio debe ser un número positivo.' })
  premioId: number;
}
