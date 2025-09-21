import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterService } from '../services/register.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly registerSerRef: RegisterService,
  ) { }

  /******************** CREATE USER ****************************/
  @Post('save')
  async createUser(@Body() data: any) {
    const result = await this.userService.upsertUser(null, data);
    return {
      message: 'User created successfully',
      data: result,
    };
  }

  /******************** UPDATE USER ****************************/
  @Post('update/:id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    const result = await this.userService.upsertUser(id, data);
    return {
      message: 'User updated successfully',
      data: result,
    };
  }

  /******************** LOGIN ****************************/
  @Post('login')
  async login(@Body() data: any) {
    return this.registerSerRef.login(data);
  }

  /******************** SEND OTP ****************************/
  @Post('send_otp')
  async sendOtp(@Body() data: any) {
    return this.registerSerRef.sendOtp(data);
  }

  /******************** VERIFY OTP ****************************/
  @Post('verify_otp')
  async verifyOtp(@Body() data: any) {
    return this.registerSerRef.verifyOtp(data);
  }

  /******************** RESET PASSWORD ****************************/
  @Post('reset_password')
  async resetPassword(@Body() data: any) {
    return this.registerSerRef.resetPassword(data);
  }

  /******************** LIST USERS ****************************/
  @Post('list')
  async listUsers(@Body() payload: any) {
    return this.userService.listUsers(payload);
  }

  /******************** GET USER BY ID ****************************/
  @Get('get/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserData(id);
  }


  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string) {
    const deleted = await this.userService.deleteUser(id);

    if (deleted) {
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } else {
      return {
        success: false,
        message: 'User not found or could not be deleted',
      };
    }
  }

}
