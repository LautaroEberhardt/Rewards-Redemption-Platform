import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class LoginGoogleDto {
  @IsEmail({}, { message: 'El correo proporcionado no es válido' })
  correo: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  nombreCompleto: string;

  @IsString()
  @IsNotEmpty({ message: 'El Google ID es obligatorio' })
  googleId: string;

  @IsUrl({}, { message: 'La foto debe ser una URL válida' })
  @IsOptional()
  foto?: string;
}
