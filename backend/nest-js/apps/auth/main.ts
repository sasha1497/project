import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  await app.listen(3001);
  console.log(`🚀 Auth service running on http://localhost:3001`);
}
bootstrap();
