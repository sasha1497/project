import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
@Module({
  imports: [], // <-- ADD this
  controllers: [UserController],
  providers: [UserService,DbService, McrudService],
})
export class UserModule {}
