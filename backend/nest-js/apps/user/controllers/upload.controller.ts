// user.controller.ts
import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetService } from '../services/asset.service';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly astSerRef:AssetService) { }

 @Post('user/dp/:id')
  @UseInterceptors(FileInterceptor('dpfile'))
  async uploadCisacuLogo(
    @UploadedFile() dpfile: Express.Multer.File,
    @Param('id') id: string,
  ) {
    try {
      const uploadData = await this.astSerRef.uploadFileToS3(dpfile, 'user');
      return {
        status: 'success',
        upload_data: {
          data: uploadData,
          file_name: uploadData.originalname,
        },
      };
    } catch (e) {
      console.error('Upload error:', e);
      return {
        status: 'failed',
        message: e.message || 'Upload failed',
      };
    }
  }
}