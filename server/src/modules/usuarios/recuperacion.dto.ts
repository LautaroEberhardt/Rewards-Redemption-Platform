import { IsEmail } from 'class-validator';

export class SolicitarRecuperacionDto {
  @IsEmail()
  correo: string;
}

export class RestablecerContrasenaDto {
  token: string;
  nuevaContrasena: string;
}
