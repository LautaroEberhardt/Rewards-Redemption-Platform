import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class CrearUsuarioDto {
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @IsString()
  nombreCompleto: string;

  @IsEmail({}, { message: 'El formato del correo no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;

  // Campos opcionales según tu entidad
  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
