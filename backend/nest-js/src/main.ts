// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

// // import { NestFactory } from '@nestjs/core';
// // import { AppModule } from './app.module';

// // async function bootstrap() {
// //   const app = await NestFactory.create(AppModule);

// //   // Allow requests from any origin
// //   app.enableCors({
// //     origin: '*', // allow all origins
// //   });

// //   await app.listen(process.env.PORT ?? 3002);
// // }
// // bootstrap();

import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { UserModule } from '../apps/user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.enableCors({
  origin: '*', 
});
  await app.listen(3002);
}
bootstrap();