import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntidad } from './modules/usuarios/entities/usuario.entity';
import { RolUsuario } from './common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

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
      this.logger.log('El usuario Admin ya existe. Saltando creación.');
      return;
    }

    this.logger.log('Creando usuario Admin por defecto...');

    try {
      const passHash = await bcrypt.hash('Admin1234!', 10);

      const nuevoAdmin = this.usuarioRepo.create({
        nombreCompleto: 'Super Admin',
        correo: emailAdmin,
        contrasena: passHash,
        rol: RolUsuario.ADMIN,
        saldoPuntosActual: 0,
      });

      await this.usuarioRepo.save(nuevoAdmin);
      this.logger.log('✨ Admin creado exitosamente');
    } catch (error) {
      const stack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error al crear el Admin por defecto', stack);
    }
  }
}
