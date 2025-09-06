import { Module } from '@nestjs/common';
import { DbService } from './services/db.service';
import { McrudService } from './services/mcurd.service';
import { MinioService } from './services/minio.service';
import { StorageService } from './services/storage.service';
import { S3Service } from './services/s3.service';

@Module({
  // imports: [
  //   DbService,
  //   McrudService,
  //   MinioService,
  //   StorageService,
  //   S3Service
  // ],
  providers: [
    DbService,
    McrudService,
    MinioService,
    StorageService,
    S3Service
  ],
  exports: [
    DbService,
    McrudService,
    MinioService,
    StorageService,
    S3Service
  ],
})
export class MainModule { }
