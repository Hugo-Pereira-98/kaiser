import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { config } from 'dotenv';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [
      'https://studio.apollographql.com',
      'http://localhost:3333',
      'http://localhost:3000',
    ],
    methods: 'POST',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
  });

  await app.listen(3333);
}

bootstrap();
