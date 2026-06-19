import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from '@fastify/helmet';
import fastifyCsrf from '@fastify/csrf-protection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigProvider } from './config';
import { usersTable } from './db/schema';
import argon2 from 'argon2';
import { ValidationPipe } from '@nestjs/common';

async function seedAdmin() {
  const env = new ConfigProvider().env;
  const db = drizzle(env.DATABASE_URL);

  await db
    .insert(usersTable)
    .values({
      role: 'ADMIN',
      email: env.ADMIN_EMAIL,
      password_hash: await argon2.hash(env.ADMIN_PASSWORD),
    })
    .onConflictDoNothing();
}

async function bootstrap() {
  await seedAdmin();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = new DocumentBuilder()
    .setTitle('Simple Schedulers')
    .setDescription('Simple Schedulers REST API documentation')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: ['*'] });

  await app.register(helmet);
  await app.register(fastifyCsrf);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
