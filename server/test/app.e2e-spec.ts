// server/test/puntos.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Flujo de Puntos (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduloReferencia: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduloReferencia.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); // Validar que los DTOs funcionen
    await app.init();
  });

  it('/puntos/asignar (POST) - Debería asignar puntos correctamente', () => {
    return request(app.getHttpServer())
      .post('/puntos/asignar')
      .send({
        usuarioId: 1,
        cantidad: 100,
        motivo: 'Compra de uniforme',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.cantidad).toEqual(100);
        expect(res.body.usuario.id).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
