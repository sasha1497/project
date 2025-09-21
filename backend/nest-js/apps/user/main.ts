import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule, { bodyParser: true });

  // Enable CORS
  app.enableCors({
    origin: '*',
  });

  // Debug incoming requests (for Postman tests)
  app.use((req, res, next) => {
    console.log('📥 Incoming request:', req.method, req.url, req.headers['content-type']);
    next();
  });

  await app.listen(3002);
  console.log(`🚀 User service running on http://localhost:3002`);
}
bootstrap();
