// server/test/historial-admin.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { limpiarBaseDeDatos, prepararAdmin, prepararCliente } from './test-utils';

jest.setTimeout(30000);

describe('Historial Admin - GET /puntos/admin/historial (E2E)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let admin: { id: string; token: string };
  let cliente: { id: string; token: string };

  beforeAll(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modulo.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await limpiarBaseDeDatos(dataSource);
    admin = await prepararAdmin(app, dataSource);
    cliente = await prepararCliente(app, dataSource, 'maria@test.com');
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Debe PROHIBIR acceso a clientes (403)', async () => {
    await request(app.getHttpServer())
      .get('/puntos/admin/historial')
      .set('Authorization', `Bearer ${cliente.token}`)
      .expect(403);
  });

  it('2. Debe devolver lista vacía si no hay transacciones', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/puntos/admin/historial')
      .set('Authorization', `Bearer ${admin.token}`)
      .expect(200);

    expect(respuesta.body.datos).toEqual([]);
    expect(respuesta.body.total).toBe(0);
    expect(respuesta.body.pagina).toBe(1);
  });

  it('3. Debe listar transacciones de TODOS los usuarios con datos del usuario', async () => {
    // Asignar puntos al cliente
    await request(app.getHttpServer())
      .post('/puntos/asignar')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ usuarioId: cliente.id, cantidad: 100, concepto: 'Compra Uniforme' })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .get('/puntos/admin/historial')
      .set('Authorization', `Bearer ${admin.token}`)
      .expect(200);

    expect(respuesta.body.datos.length).toBe(1);
    expect(respuesta.body.total).toBe(1);

    const transaccion = respuesta.body.datos[0];
    expect(transaccion.cantidad).toBe(100);
    expect(transaccion.tipo).toBe('INGRESO');
    expect(transaccion.concepto).toBe('Compra Uniforme');
    expect(transaccion.usuario).toBeDefined();
    expect(transaccion.usuario.nombreCompleto).toBe('Cliente de Prueba');
    expect(transaccion.usuario.correo).toBe('maria@test.com');
  });

  it('4. Debe filtrar por tipo INGRESO', async () => {
    // Crear un ingreso
    await request(app.getHttpServer())
      .post('/puntos/asignar')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ usuarioId: cliente.id, cantidad: 200, concepto: 'Compra' })
      .expect(201);

    // Crear un egreso (retiro)
    await request(app.getHttpServer())
      .post('/puntos/asignar')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ usuarioId: cliente.id, cantidad: -50, concepto: 'Ajuste' })
      .expect(201);

    // Filtrar solo INGRESO
    const respuesta = await request(app.getHttpServer())
      .get('/puntos/admin/historial?tipo=INGRESO')
      .set('Authorization', `Bearer ${admin.token}`)
      .expect(200);

    expect(respuesta.body.datos.length).toBe(1);
    expect(respuesta.body.datos[0].tipo).toBe('INGRESO');
  });

  it('5. Debe filtrar por tipo EGRESO', async () => {
    await request(app.getHttpServer())
      .post('/puntos/asignar')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ usuarioId: cliente.id, cantidad: 200, concepto: 'Compra' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/puntos/asignar')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ usuarioId: cliente.id, cantidad: -50, concepto: 'Ajuste' })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .get('/puntos/admin/historial?tipo=EGRESO')
      .set('Authorization', `Bearer ${admin.token}`)
      .expect(200);

    expect(respuesta.body.datos.length).toBe(1);
    expect(respuesta.body.datos[0].tipo).toBe('EGRESO');
  });

  it('6. Debe paginar correctamente', async () => {
    // Crear 3 transacciones
    for (let i = 1; i <= 3; i++) {
      await request(app.getHttpServer())
        .post('/puntos/asignar')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({ usuarioId: cliente.id, cantidad: i * 10, concepto: `Compra ${i}` })
        .expect(201);
    }

    // Pedir página 1 con límite 2
    const pagina1 = await request(app.getHttpServer())
      .get('/puntos/admin/historial?pagina=1&limite=2')
      .set('Authorization', `Bearer ${admin.token}`)
      .expect(200);

    expect(pagina1.body.datos.length).toBe(2);
    expect(pagina1.body.total).toBe(3);
    expect(pagina1.body.pagina).toBe(1);

    // Pedir página 2
    const pagina2 = await request(app.getHttpServer())
      .get('/puntos/admin/historial?pagina=2&limite=2')
      .set('Authorization', `Bearer ${admin.token}`)
      .expect(200);

    expect(pagina2.body.datos.length).toBe(1);
    expect(pagina2.body.pagina).toBe(2);
  });

  it('7. Debe ignorar tipos inválidos y devolver todo', async () => {
    await request(app.getHttpServer())
      .post('/puntos/asignar')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ usuarioId: cliente.id, cantidad: 100, concepto: 'Test' })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .get('/puntos/admin/historial?tipo=INVALIDO')
      .set('Authorization', `Bearer ${admin.token}`)
      .expect(200);

    expect(respuesta.body.datos.length).toBe(1);
  });
});
