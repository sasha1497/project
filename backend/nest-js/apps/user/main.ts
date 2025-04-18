import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  await app.listen(3002);
  console.log(`🚀 User service running on http://localhost:3002`);
}
bootstrap();
