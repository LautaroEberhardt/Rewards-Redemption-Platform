import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntidad } from './usuario.entidad';
import { TokenRecuperacionEntidad } from './token-recuperacion.entidad';
import { SolicitarRecuperacionDto, RestablecerContrasenaDto } from './recuperacion.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RecuperacionContrasenaServicio {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly usuariosRepo: Repository<UsuarioEntidad>,
    @InjectRepository(TokenRecuperacionEntidad)
    private readonly tokensRepo: Repository<TokenRecuperacionEntidad>,
  ) {}

  async solicitarRecuperacion(dto: SolicitarRecuperacionDto): Promise<void> {
    const usuario = await this.usuariosRepo.findOne({ where: { correo: dto.correo } });
    if (!usuario) return;

    const token = crypto.randomBytes(48).toString('hex');
    const expiraEn = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await this.tokensRepo.save({ token, usuario, expiraEn });
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
