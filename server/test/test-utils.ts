// server/test/test-utils.ts
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { AppService } from '../src/app.service';
import * as bcrypt from 'bcrypt';
import { RolUsuario } from '../src/common/enums/roles.enum';

/**
 * Limpia todas las tablas de la base de datos de pruebas.
 */
export async function limpiarBaseDeDatos(dataSource: DataSource) {
  const entidades = dataSource.entityMetadatas;
  for (const entidad of entidades) {
    const repositorio = dataSource.getRepository(entidad.name);
    await repositorio.query(`TRUNCATE "${entidad.tableName}" RESTART IDENTITY CASCADE;`);
  }
}

/**
 * Crea el admin por defecto, hace login y devuelve su ID y Token.
 */
export async function prepararAdmin(app: INestApplication, dataSource: DataSource) {
  const appService = app.get(AppService);
  await appService.crearAdminPorDefecto();

  const adminRepo = dataSource.getRepository('UsuarioEntidad');
  const admin = await adminRepo.findOne({ where: { correo: 'admin@fidelizacion.com' } });

  const respuestaLogin = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ correo: 'admin@fidelizacion.com', contrasena: 'Admin1234!' })
    .expect(200);

  return {
    id: admin.id,
    token: respuestaLogin.body.token || respuestaLogin.body.access_token,
  };
}

/**
 * Crea un cliente ficticio en la BD, hace login y devuelve su ID y Token.
 */
export async function prepararCliente(
  app: INestApplication,
  dataSource: DataSource,
  correo = 'cliente@test.com',
) {
  const usuarioRepo = dataSource.getRepository('UsuarioEntidad');
  const passHash = await bcrypt.hash('Cliente123!', 10);

  const nuevoCliente = usuarioRepo.create({
    nombreCompleto: 'Cliente de Prueba',
    correo: correo,
    contrasena: passHash,
    rol: RolUsuario.CLIENTE,
    saldoPuntosActual: 0,
  });
  await usuarioRepo.save(nuevoCliente);

  const respuestaLogin = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ correo: correo, contrasena: 'Cliente123!' })
    .expect(200);

  return {
    id: nuevoCliente.id,
    token: respuestaLogin.body.token || respuestaLogin.body.access_token,
  };
}
