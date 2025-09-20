// user.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';

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
    return this.userService.login(data);
  }

  @Post('send_otp')
  async sendOtp(@Body() data: { mobileNumber: string }) {
    return this.userService.sendOtp(data);
  }


  @Post('verify_otp')
  async verifyOtp(@Body() data: { mobileNumber: string; otp: string }) {
    return this.userService.verifyOtp(data);
  }


  @Post('reset_password')
  async resetPassword(@Body() data: { mobileNumber: string; otp: string; newPassword: string }) {
    return this.userService.resetPassword(data);
  }



  @Post('list')
  async listUsers(@Body() payload) {
    return this.userService.listUsers(payload);
  }

  @Get('get/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserData(id);
  }
}
