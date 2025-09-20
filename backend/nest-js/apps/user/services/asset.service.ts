import { McrudService } from '@app/main/services/mcurd.service';
import { StorageService } from '@app/main/services/storage.service';
import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import sharp from 'sharp';
const convert = require('heic-convert');

@Injectable()
export class AssetService {
  constructor(private readonly mcurdService: McrudService, private readonly s6SerRef:StorageService) { }


 async uploadFileToS3(file: Express.Multer.File, id, path = 'users') {

    const { originalname, mimetype } = file;
    const compressedBuffer = await this.compressFile(file);
    const s3UploadData = await this.s6SerRef.upload(
      compressedBuffer,
      path,
      originalname,
      mimetype,
      id
    );

    
    return {
      originalname,
      s3UploadData,
    };
  }

  async updateUserImages(id,fileNames){
        const user = await this.mcurdService.update('users', { photo: JSON.stringify(fileNames) }, {
      'id': id,
    });

  }

  
  async compressFile(file: Express.Multer.File): Promise<Buffer> {
    let compressType: 'jpeg' | 'png' | 'webp';
    let compressConfig: any;

    switch (file.mimetype) {
      case 'image/jpeg':
        compressType = 'jpeg';
        compressConfig = { mozjpeg: true, quality: 86 };
        break;
      case 'image/png':
        compressType = 'png';
        compressConfig = { quality: 86 };
        break;
      case 'image/webp':
        compressType = 'webp';
        compressConfig = { quality: 86 };
        break;
      case 'image/heic':
        compressType = 'jpeg';
        compressConfig = { mozjpeg: true, quality: 86 };
        file.buffer = await convert({
          buffer: file.buffer,
          format: 'JPEG',
          quality: 1,
        });
        break;
      default:
        return file.buffer; // No compression
    }

    return sharp(file.buffer)
      .toFormat(compressType, compressConfig)
      .toBuffer();
  }
}


