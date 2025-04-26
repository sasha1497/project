// user.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('upsert')
  async upsertUser(@Body() body: any) {
    const { id, ...data } = body;

    return this.userService.upsertUser(id, data);
  }
}
