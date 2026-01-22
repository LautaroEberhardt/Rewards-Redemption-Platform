import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { RolUsuario } from 'src/common/enums/roles.enum';
import { UsuarioEntidad } from './entities/usuario.entity';
import { CrearUsuarioDto } from './dtos/crear-usuario.dto';
import { LoginGoogleDto } from './dtos/login-google.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly usuarioRepositorio: Repository<UsuarioEntidad>,
  ) {}

  // --- REGISTRO CON EMAIL Y CONTRASEÑA (Tu código adaptado) ---
  async crear(crearUsuarioDto: CrearUsuarioDto): Promise<UsuarioEntidad> {
    const { contrasena, ...datosUsuario } = crearUsuarioDto;

    try {
      // 1. Encriptar contraseña (10 rondas de sal)
      const hashContrasena = await hash(contrasena, 10);

      // 2. Crear instancia del usuario
      const nuevoUsuario = this.usuarioRepositorio.create({
        ...datosUsuario,
        rol: RolUsuario.CLIENTE, // Rol por defecto
        saldoPuntosActual: 0,
      });
      nuevoUsuario.contrasena = hashContrasena;

      // 3. Guardar en Base de Datos
      await this.usuarioRepositorio.save(nuevoUsuario);

      return nuevoUsuario;
    } catch (error: any) {
      // Manejo de error de duplicados (Postgres error 23505)
      if (error.code === '23505') {
        throw new ConflictException('El email ya está registrado en el sistema.');
      }
      console.error('Error al crear usuario:', error);
      throw new InternalServerErrorException('Error inesperado al crear el usuario.');
    }
  }

  async buscarPorId(id: string): Promise<UsuarioEntidad | null> {
    return this.usuarioRepositorio.findOneBy({ id });
  }

  async findAll(): Promise<UsuarioEntidad[]> {
    try {
      return await this.usuarioRepositorio.find({
        order: {
          fechaCreacion: 'DESC',
        },
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new InternalServerErrorException('Error al cargar la lista de usuarios');
    }
  }

  // --- LOGIN / REGISTRO CON GOOGLE (Lógica existente) ---
  async validarORegistrarUsuarioGoogle(loginGoogleDto: LoginGoogleDto): Promise<UsuarioEntidad> {
    const { email, googleId, nombreCompleto, foto } = loginGoogleDto;

    // 1. Buscamos si ya existe por email
    const usuarioExistente = await this.usuarioRepositorio.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      // 2. Si existe, vinculamos la cuenta si no lo estaba
      if (!usuarioExistente.googleId) {
        usuarioExistente.googleId = googleId;
        usuarioExistente.foto = foto || usuarioExistente.foto;
        return this.usuarioRepositorio.save(usuarioExistente);
      }
      return usuarioExistente;
    }

    // 3. Si no existe, creamos uno nuevo
    const nuevoUsuario = this.usuarioRepositorio.create({
      email,
      nombreCompleto,
      googleId,
      foto,
      rol: RolUsuario.CLIENTE,
      saldoPuntosActual: 0,
      // No asignamos 'contrasena' porque entra por Google
    });

    return this.usuarioRepositorio.save(nuevoUsuario);
  }

  // --- MÉTODOS AUXILIARES ---
  async buscarPorEmail(email: string): Promise<UsuarioEntidad | null> {
    return this.usuarioRepositorio.findOne({ where: { email } });
  }
}
