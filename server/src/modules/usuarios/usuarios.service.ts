import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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
      const hashContrasena = await bcrypt.hash(contrasena, 10);

      const nuevoUsuario = this.usuarioRepositorio.create({
        ...datosUsuario,
        contrasena: hashContrasena, // 3. Asignamos el hash ya resuelto
      });

      await this.usuarioRepositorio.save(nuevoUsuario);

      // Retornamos sin la contraseña por seguridad
      return nuevoUsuario;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        throw new ConflictException('El email o DNI ya están registrados');
      }
      console.error(error);
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async buscarPorEmailConSecreto(email: string): Promise<UsuarioEntidad | null> {
    return this.usuarioRepositorio.findOne({
      where: { email },
      select: ['id', 'email', 'contrasena', 'rol', 'nombreCompleto'], // Explicitamente pedimos la contraseña
    });
  }

  async buscarPorEmailConPassword(email: string): Promise<UsuarioEntidad | null> {
    return await this.usuarioRepositorio.findOne({
      where: { email },
      select: ['id', 'nombreCompleto', 'email', 'contrasena', 'rol'],
    });
  }

  async buscarOCrearGoogle(perfil: any): Promise<UsuarioEntidad> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const usuarioExistente = await this.usuarioRepositorio.findOneBy({ email: perfil.email });
    if (usuarioExistente) return usuarioExistente;

    // Si no existe, lo creamos (Estrategia para login social)
    const nuevoUsuario = this.usuarioRepositorio.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      nombreCompleto: perfil.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      email: perfil.email,
      rol: RolUsuario.CLIENTE, // Por defecto siempre es cliente
    });
    return await this.usuarioRepositorio.save(nuevoUsuario);
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

  async findPaginated(
    page = 1,
    limit = 20,
  ): Promise<{ items: UsuarioEntidad[]; total: number; page: number; limit: number }> {
    try {
      const skip = Math.max(0, (page - 1) * limit);
      const take = Math.max(1, limit);

      const [items, total] = await this.usuarioRepositorio.findAndCount({
        order: { fechaCreacion: 'DESC' },
        skip,
        take,
      });

      return { items, total, page, limit };
    } catch (error) {
      console.error('Error al obtener usuarios paginados:', error);
      throw new InternalServerErrorException('Error al cargar usuarios paginados');
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
