import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';  // import ConfigModule here

import { UserController } from './controllers/user.controller';
import { RazorpayController } from './controllers/razorpay.controller';

import { UserService } from './services/user.service';
import { RazorpayService } from './services/razorpay.service';

import { DbService } from 'libs/services/src/db.service';
import { McrudService } from 'libs/services/src/mcurd.service';
import { SubscriptionService } from './services/subscription.service';
import { UploadController } from './controllers/upload.controller';
import { AssetService } from './services/asset.service';
import { StorageService } from 'libs/services/src/storage.service';
import { S3Service } from 'libs/services/src/s3.service';
import { MinioService } from 'libs/services/src/minio.service';
import { UserModel } from './model/user.model';

@Module({
  imports: [
    ConfigModule,  // import ConfigModule here for ConfigService injection
  ],
  controllers: [
    UserController,
    RazorpayController,
    UploadController  // controllers only here
  ],
  providers: [
    UserService,
    DbService,
    McrudService,
    RazorpayService,  
    UserModel,
    SubscriptionService,
    AssetService,
    StorageService,
    S3Service,
    MinioService
  ],
})
export class UserModule {}
