// user.controller.ts
import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('upsert/:id')
  async upsertUser(@Param('id') id: string, @Body() data: any) {
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
