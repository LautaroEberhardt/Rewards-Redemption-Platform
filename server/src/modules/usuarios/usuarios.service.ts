import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
      const hashContrasena = await hash(contrasena, 10);

      const nuevoUsuario = this.usuarioRepo.create({
        ...datosUsuario,
        contrasena: hashContrasena,
      });

      await this.usuarioRepo.save(nuevoUsuario);

      return nuevoUsuario;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El email o DNI ya están registrados');
      }
      console.error(error);
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }
}
