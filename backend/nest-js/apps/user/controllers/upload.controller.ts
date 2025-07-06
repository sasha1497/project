// user.controller.ts
import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AssetService } from '../services/asset.service';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly astSerRef:AssetService) { }

@Post('user/dp/:id')
@UseInterceptors(FilesInterceptor('dpfile', 10))
async uploadMultipleDpFiles(
  @UploadedFiles() dpfiles: Express.Multer.File[],
  @Param('id') id: string,
) {
  try {
    const unixTime = Date.now();
    
    const renamedFiles = dpfiles.map((file, idx) => {
      const newFileName = `${unixTime + idx}_${file.originalname}`;
      return { ...file, newFileName };
    });

    const uploadedData = await Promise.all(
      renamedFiles.map((fileObj) =>
        this.astSerRef.uploadFileToS3(
          { ...fileObj, originalname: fileObj.newFileName },
          'user'
        )
      )
    );

    const finalFileNames = renamedFiles.map((f) => f.newFileName);

    console.log(id, JSON.stringify(finalFileNames));
    
    await this.astSerRef.updateUserImages(id, JSON.stringify(finalFileNames));

    return {
      status: 'success',
      files: finalFileNames,
      upload_data: uploadedData,
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