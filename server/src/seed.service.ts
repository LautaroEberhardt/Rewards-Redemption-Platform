import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuarioEntidad } from './modules/usuarios/entities/usuario.entity';
import { RolUsuario } from './common/enums/roles.enum';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly usuarioRepo: Repository<UsuarioEntidad>,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') return;

    const email = 'admin@fidelizacion.com';
    const existe = await this.usuarioRepo.findOne({ where: { email } });
    if (existe) return;

    const hash = await bcrypt.hash('Admin1234!', 10);
    const admin = this.usuarioRepo.create({
      nombreCompleto: 'Administrador',
      email,
      contrasena: hash,
      rol: RolUsuario.ADMIN,
      saldoPuntosActual: 0,
    });
    await this.usuarioRepo.save(admin);
    // eslint-disable-next-line no-console
    console.log('[SEED] Usuario admin creado:', email);
  }
}
