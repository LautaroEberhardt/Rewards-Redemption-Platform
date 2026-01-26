// server/src/modules/puntos/dtos/asignar-puntos.dto.ts
import { IsUUID, IsInt, IsString, IsPositive, IsOptional } from 'class-validator';

export class AsignarPuntosDto {
  @IsUUID('4', { message: 'ID de usuario inválido' })
  usuarioId: string;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsPositive({ message: 'La cantidad debe ser mayor a cero' })
  cantidad: number;

  @IsString({ message: 'Debe proporcionar un motivo o concepto' })
  concepto: string;

  @IsOptional()
  @IsString()
  referenciaOperacion?: string; // Ej: ID de la factura de compra
}
