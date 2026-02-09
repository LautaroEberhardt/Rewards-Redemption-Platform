import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO para que un cliente actualice su propio perfil.
 * Solo se permiten campos seguros (no email, no rol, no contraseña).
 */
export class ActualizarPerfilDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombreCompleto?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
