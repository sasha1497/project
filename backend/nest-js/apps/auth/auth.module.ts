import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MainModule } from '@app/main';

@Module({
  imports:[MainModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
