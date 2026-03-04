// server/test/canjes.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { limpiarBaseDeDatos, prepararAdmin, prepararCliente } from './test-utils';

jest.setTimeout(30000);

describe('Controlador de Canjes (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let admin: { id: string; token: string };
  let cliente: { id: string; token: string };
  let premioId: number;

  beforeAll(async () => {
    const moduloReferencia: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduloReferencia.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    // 1. Setup en 4 líneas (Clean Code)
    await limpiarBaseDeDatos(dataSource);
    admin = await prepararAdmin(app, dataSource);
    cliente = await prepararCliente(app, dataSource, 'juan@cliente.com');

    // 2. Creamos el premio rápido
    const premioRepo = dataSource.getRepository('PremioEntidad');
    const nuevoPremio = await premioRepo.save(premioRepo.create({ nombre: 'Termo', costoEnPuntos: 500, stock: 10, activo: true }));
    premioId = nuevoPremio.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Flujo de Canje de Premios', () => {
    it('1. Debe RECHAZAR el canje (400) si NO hay puntos', async () => {
      return request(app.getHttpServer()).post('/canjes').set('Authorization', `Bearer ${cliente.token}`).send({ premioId }).expect(400);
    });

    it('2. Debe CREAR el canje (201) si SI hay puntos', async () => {
      await request(app.getHttpServer())
        .post('/puntos/asignar')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({ usuarioId: cliente.id, cantidad: 600, concepto: 'Regalo' }).expect(201);

      const respuesta = await request(app.getHttpServer()).post('/canjes').set('Authorization', `Bearer ${cliente.token}`)
        .send({ premioId }).expect(201);

      expect(respuesta.body.canje.puntosGastados).toBe(500);
    });

    it('3. Debe PROHIBIR el acceso (403) al ADMIN', async () => {
      return request(app.getHttpServer()).post('/canjes').set('Authorization', `Bearer ${admin.token}`).send({ premioId }).expect(403);
    });
  });
});
