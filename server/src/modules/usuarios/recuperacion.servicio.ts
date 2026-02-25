import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntidad } from './usuario.entidad';
import { TokenRecuperacionEntidad } from './token-recuperacion.entidad';
import { SolicitarRecuperacionDto, RestablecerContrasenaDto } from './recuperacion.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import type { AdaptadorCorreo } from 'src/common/adaptadores/adaptador-correo';

@Injectable()
export class RecuperacionContrasenaServicio {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly usuariosRepo: Repository<UsuarioEntidad>,
    @InjectRepository(TokenRecuperacionEntidad)
    private readonly tokensRepo: Repository<TokenRecuperacionEntidad>,
    @Inject('AdaptadorCorreo')
    private readonly adaptadorCorreo: AdaptadorCorreo,
  ) {}

  async solicitarRecuperacion(dto: SolicitarRecuperacionDto): Promise<void> {
    const usuario = await this.usuariosRepo.findOne({ where: { correo: dto.correo } });
    if (!usuario) return;

    const token = crypto.randomBytes(48).toString('hex');
    const expiraEn = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await this.tokensRepo.save({ token, usuario, expiraEn });

    // Enviar correo real
    const urlFrontend = process.env.URL_FRONTEND || 'http://localhost:3000';
    const enlace = `${urlFrontend}/recuperar-contrasena?token=${token}`;
    const asunto = 'Recuperación de contraseña';
    const html = `
      <p>Hola,</p>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para continuar:</p>
      <p><a href="${enlace}">${enlace}</a></p>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
      <p>El enlace expirará en 15 minutos.</p>
    `;
    await this.adaptadorCorreo.enviarCorreo(usuario.correo, asunto, html);
  }

  async restablecerContrasena(dto: RestablecerContrasenaDto): Promise<void> {
    const tokenEntidad = await this.tokensRepo.findOne({
      where: { token: dto.token },
      relations: ['usuario'],
    });
    if (!tokenEntidad) throw new Error('Token inválido o expirado');
    if (tokenEntidad.expiraEn < new Date()) throw new Error('Token expirado');

    const hash = await bcrypt.hash(dto.nuevaContrasena, 12);
    tokenEntidad.usuario.contrasena = hash;
    await this.usuariosRepo.save(tokenEntidad.usuario);
    await this.tokensRepo.delete({ id: tokenEntidad.id });
  }
}
