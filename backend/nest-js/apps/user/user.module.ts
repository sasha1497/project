import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // import ConfigModule here

import { UserController } from './controllers/user.controller';
import { RazorpayController } from './controllers/razorpay.controller';

import { UserService } from './services/user.service';
import { RazorpayService } from './services/razorpay.service';

import { SubscriptionService } from './services/subscription.service';
import { UploadController } from './controllers/upload.controller';
import { AssetService } from './services/asset.service';
import { UserModel } from './model/user.model';
import { MainModule } from '@app/main/main.module';
import { SMSService } from './services/sms.service';
import { RegisterService } from './services/register.service';
import { MailService } from './services/mail.service';
import { CashfreeController } from './controllers/cashfree.controller';
import { CashfreeService } from './services/cashfree.service';

@Module({
  imports: [
    ConfigModule,  // import ConfigModule here for ConfigService injection
    MainModule
  ],
  controllers: [
    UserController,
    RazorpayController,
    UploadController , // controllers only here
    CashfreeController,
  ],
  providers: [
    UserService,
    RazorpayService,  
    UserModel,
    SubscriptionService,
    CashfreeService,
    AssetService,
    SMSService,
    RegisterService,
    MailService,
    CashfreeService
  ],
})
export class UserModule {}
