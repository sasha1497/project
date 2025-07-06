// user.controller.ts
import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AssetService } from '../services/asset.service';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly astSerRef:AssetService) { }

 @Post('user/dp/:id')
@UseInterceptors(FilesInterceptor('dpfile', 10)) // 10 is the max count of files allowed
async uploadMultipleDpFiles(
  @UploadedFiles() dpfiles: Express.Multer.File[],
  @Param('id') id: string,
) {
  try {
    const uploadedData = await Promise.all(
      dpfiles.map((file) => this.astSerRef.uploadFileToS3(file, 'user')),
    );

    return {
      status: 'success',
      upload_data: uploadedData.map((data, index) => ({
        data,
        file_name: dpfiles[index].originalname,
      })),
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