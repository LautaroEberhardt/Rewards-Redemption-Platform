import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function iniciarServidor() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  // En producción, el origen debe ser la URL de Vercel
  const origenesPermitidos = process.env.URL_FRONTEND || 'http://localhost:3001';

  app.enableCors({
    origin: origenesPermitidos,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Tipado Estricto y Validación Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma los payloads a los tipos de los DTOs
    }),
  );

  const puerto = process.env.PORT || 4000;
  await app.listen(puerto);
  console.log(`🚀 Servidor corriendo en: http://localhost:${puerto}`);
}

iniciarServidor();
