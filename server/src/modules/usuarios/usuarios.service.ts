import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntidad } from './entities/usuario.entity';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly usuarioRepo: Repository<UsuarioEntidad>,
  ) {}

  async crear(crearUsuarioDto: CrearUsuarioDto): Promise<UsuarioEntidad> {
    const { contrasena, ...datosUsuario } = crearUsuarioDto;

    try {
      // 1. Encriptar contraseña
      const hashContrasena = await hash('admin123', 10);

      // 2. Crear instancia (sin guardar aún)
      const nuevoUsuario = this.usuarioRepo.create({
        ...datosUsuario,
        contrasena: hashContrasena,
        // El rol por defecto ya es CLIENTE en la entidad
      });

      // 3. Guardar en DB
      await this.usuarioRepo.save(nuevoUsuario);

      // 4. Limpiar respuesta (no devolver pass)
      delete nuevoUsuario.contrasena;
      return nuevoUsuario;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El email o DNI ya están registrados');
      }
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }
}
