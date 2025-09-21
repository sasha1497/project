import { Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';
import { S3Service } from './s3.service';
@Injectable()
export class StorageService {

    isAws = process.env.S3_AWS == "1";
    // isSingle = loadConfig()== '1';

    minioClient: any;
    s3Client: any;

    constructor(private minioSerRef: MinioService, private s3SerRef: S3Service) {
    }


    get clientSerRef() {
        return process.env.ISAWS === "1" ? this.s3SerRef : this.minioSerRef;
    }

    //upload file to s3 buckets
    async upload(file, toPath, filename, mimetype, id) {
        let data = await this.clientSerRef.upload(file, toPath, filename, mimetype, id);
        return data

    }

    // get file from s3 buckets to preview
    async getFileAsResponse(response, userId, path, fileName, useSharp = false, thumbScale: any = false, extension = null, isAws = false) {
        const clientSerRef = isAws ? this.s3SerRef : this.clientSerRef;
        await clientSerRef.getFileAsResponse(response, userId, path, fileName, useSharp, thumbScale, extension);
    }

    // copy file from s3 buckets to actual paths
    async copyToCompanyBucket(userId: string, fromPath: string, filename: string, toPath: string) {
        return this.clientSerRef.copyFile(userId, fromPath, filename, toPath);
    }

    // delete file from s3 buckets
    async deleteFile(userId, path, fileName) {
        return this.clientSerRef.deleteFile(userId, path, fileName);
    }

    // move file from s3 buckets to actual paths
    async movetoCompanyBucket(userId, fromPath, value, actualPath) {
        return this.clientSerRef.putFile(userId, fromPath, value, actualPath);
    }

    // get object form s3 bucket
    async getObjectFromS3(userId, path, filename) {
        return this.clientSerRef.getObjectFromS3(userId, path, filename);
    }

    // get file url form s3 bucket
    async getFileUrl(userId, path, file) {
        return this.clientSerRef.getFileUrl(userId, path, file);
    }

    // remove file form s3 bucket
    async removeFromCompanyBucket(userId, path, file) {
        return this.clientSerRef.removeFromCompanyBucket(userId, path, file);
    }

    //check file exits in s3 bucket
    async isFileExists(userId, key) {
        return this.clientSerRef.isFileExists(userId, key);
    }

    async listObjects() {
        // return this.clientSerRef.bucketList();
    }

    async getImageUrl(filePath: string): Promise<string> {
        console.log("triigerstorage service");
        console.log(filePath,"<--------filepath");
        
        
        return this.clientSerRef.getSignedUrl(filePath)
    }


}
