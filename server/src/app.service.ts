import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntidad } from './modules/usuarios/entities/usuario.entity';
import { RolUsuario } from './common/enums/roles.enum'; // Asegúrate de tener este enum
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly usuarioRepo: Repository<UsuarioEntidad>,
  ) {}

  // Este método se ejecuta automáticamente al iniciar la app
  async onApplicationBootstrap() {
    await this.crearAdminPorDefecto();
  }

  async crearAdminPorDefecto() {
    const emailAdmin = 'admin@fidelizacion.com';
    // 1. Verificamos si ya existe
    const existe = await this.usuarioRepo.findOneBy({ email: emailAdmin });
    if (existe) {
      console.log('✅ El usuario Admin ya existe. Saltando creación.');
      return;
    }

    // 2. Si no existe, lo creamos
    console.log('🚀 Creando usuario Admin por defecto...');
    const nuevoAdmin = this.usuarioRepo.create({
      nombre: 'Super Admin',
      email: emailAdmin,
      password: await bcrypt.hash('admin123', 10), // ¡Cambiar contraseña en prod!
      rol: RolUsuario.ADMIN, // <--- AQUÍ LA MAGIA
    });

    await this.usuarioRepo.save(nuevoAdmin);
    console.log('✨ Admin creado exitosamente: admin@fidelizacion.com / admin123');
  }

  getHello(): string {
    return 'API Funcionando 🚀';
  }
}
