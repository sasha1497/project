import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
import { UserModel } from './user.model';
@Module({
  imports: [], // <-- ADD this
  controllers: [UserController],
  providers: [UserService,DbService, McrudService, UserModel],
})
export class UserModule {}
