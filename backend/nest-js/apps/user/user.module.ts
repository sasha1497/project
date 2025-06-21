import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // import ConfigModule here

import { UserController } from './controllers/user.controller';
import { RazorpayController } from './controllers/razorpay.controller';

import { UserService } from './services/user.service';
import { RazorpayService } from './services/razorpay.service';

import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
import { SubscriptionService } from './services/subscription.service';
import { UserModel } from './model/user.model';

@Module({
  imports: [
    ConfigModule,  // import ConfigModule here for ConfigService injection
  ],
  controllers: [
    UserController,
    RazorpayController,  // controllers only here
  ],
  providers: [
    UserService,
    DbService,
    McrudService,
    RazorpayService,  
    SubscriptionService,// services/providers here (only once)
    UserModel
  ],
})
export class UserModule {}
