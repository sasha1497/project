// user.controller.ts
import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('save')  // Create user (no id param)
  async createUser(@Body() data: any) {
    const result = await this.userService.upsertUser(null, data);
    return {
      message: 'User created successfully',
      data: result,
    };
  }

  @Post('update/:id')  // Update user by id
  async updateUser(@Param('id') id: string, @Body() data: any) {
    const result = await this.userService.upsertUser(id, data);
    return {
      message: 'User updated successfully',
      data: result,
    };
  }

  @Post('login')
  async login(@Body() data: { mobileNumber: string; password: string }) {
    return this.userService.loginNew(data);
  }

}
