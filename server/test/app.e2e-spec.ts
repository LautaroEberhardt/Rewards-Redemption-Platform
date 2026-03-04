import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { limpiarBaseDeDatos, prepararAdmin } from './test-utils';

jest.setTimeout(30000);

describe('Controlador de Puntos (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let admin: { id: string; token: string };

  beforeAll(async () => {
    const moduloReferencia: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduloReferencia.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await limpiarBaseDeDatos(dataSource);
    admin = await prepararAdmin(app, dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/puntos/asignar (POST)', () => {
    it('Debe retornar 201 y la transacción creada si los datos son válidos', async () => {
      const respuesta = await request(app.getHttpServer())
        .post('/puntos/asignar')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          usuarioId: admin.id,
          cantidad: 50,
          concepto: 'Compra de prueba E2E',
        })
        .expect(201);

      expect(respuesta.body).toHaveProperty('id');
      expect(respuesta.body.cantidad).toBe(50);
    });

    it('Debe retornar 400 si la cantidad es negativa', async () => {
      return request(app.getHttpServer())
        .post('/puntos/asignar')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({ usuarioId: admin.id, cantidad: -10, concepto: 'Error' })
        .expect(400);
    });
  });
});
