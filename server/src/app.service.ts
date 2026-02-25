import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntidad } from './modules/usuarios/entities/usuario.entity';
import { RolUsuario } from './common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly usuarioRepo: Repository<UsuarioEntidad>,
  ) {}

  async onApplicationBootstrap() {
    await this.crearAdminPorDefecto();
  }

  async crearAdminPorDefecto() {
    const emailAdmin = 'admin@fidelizacion.com';
    const existe = await this.usuarioRepo.findOneBy({ correo: emailAdmin });
    if (existe) {
      console.log('✅ El usuario Admin ya existe. Saltando creación.');
      return;
    }

    console.log('🚀 Creando usuario Admin por defecto...');

    const passHash = await bcrypt.hash('Admin1234!', 10);

    const nuevoAdmin = this.usuarioRepo.create({
      nombreCompleto: 'Super Admin',
      correo: emailAdmin,
      contrasena: passHash,
      rol: RolUsuario.ADMIN,
    });

    await this.usuarioRepo.save(nuevoAdmin);
    console.log('✨ Admin creado exitosamente');
  }
}
