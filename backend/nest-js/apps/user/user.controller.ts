// user.controller.ts
import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('upsert')
  async upsertUser(@Body() body: any) {
    const { id, ...data } = body;
    const result = await this.userService.upsertUser(id, data);

    if (id) {
      return {
        message: 'User updated successfully',
        data: result,
      };
    } else {
      return {
        message: 'User created successfully',
        data: result,
      };
    }
  }

}
