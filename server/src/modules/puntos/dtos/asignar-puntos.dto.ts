import { IsUUID, IsInt, IsString, IsOptional, NotEquals } from 'class-validator';

export class AsignarPuntosDto {
  @IsUUID('4', { message: 'ID de usuario inválido' })
  usuarioId: string;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @NotEquals(0, { message: 'La cantidad no puede ser cero' })
  cantidad: number;

  @IsOptional()
  @IsString({ message: 'El concepto debe ser texto' })
  concepto?: string;

  @IsOptional()
  @IsString()
  referenciaOperacion?: string;
}
