import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommandInput, CreateBucketCommand, HeadBucketCommand, GetObjectCommand, DeleteObjectCommand, CopyObjectCommand, PutObjectCommand, HeadObjectCommand, GetObjectCommandInput, ListBucketsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as fs from 'fs';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    client: any;
    bucket = process.env.AWS_BUCKET_NAME;

    constructor() {
        const accessKeyId = process.env.AWS_S3_KEY;
        const secretAccessKey = process.env.AWS_S3_SECRET;

        console.log(accessKeyId, secretAccessKey, 'access+++++');
        

        if (!accessKeyId || !secretAccessKey) {
            throw new Error("AWS credentials are not set in environment variables");
        }

        this.client = new S3Client({
            credentials: { accessKeyId, secretAccessKey },
            region: process.env.AWS_REGION,
        });

        console.log('hiiiijihib')
    }

    async upload(file: Buffer | string, toPath: string, filename: string, mimetype: string, userId: string) {
        const key = `${userId}/${toPath}/${filename}`;
        const params: PutObjectCommandInput = {
            Bucket: this.bucket,
            Key: key,
            Body: file,
            // ACL: 'public-read',
            ContentType: mimetype,
            ContentDisposition: 'inline',
        };
        const upload = new Upload({ client: this.client, params });
        return await upload.done();
    }

    // async getSignedUrl(filePath: string): Promise<string> {
    //     const params = { Bucket: this.bucket, Key: filePath, Expires: 24 * 60 * 60 };
    //     return this.client.getSignedUrlPromise('getObject', params);
    // }

     async getSignedUrl(filePath: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
    });

    return getSignedUrl(this.client, command, { expiresIn: 24 * 60 * 60 });
  }

    async getFileAsResponse(response, userId, path, fileName, useSharp = false, thumbScale: any = false, extension = null) {
        const key = `${userId}/${path}/${fileName}`;
        const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
        const data = await this.client.send(command);

        if (useSharp) {
            const chunks: Buffer[] = [];
            data.Body.on('data', chunk => chunks.push(chunk));
            data.Body.on('end', async () => {
                // const processed = await sharp(Buffer.concat(chunks)).toBuffer();
                // response.send(processed);
            });
        } else {
            data.Body.pipe(response);
        }
    }

    async copyFile(userId: string, fromPath: string, filename: string, toPath: string) {
        const uniqueFileName = await this.getUniqueFileName(userId, toPath, filename);
        let copySource = encodeURIComponent(`${this.bucket}/${userId}/${fromPath}/${filename}`);
        let key = `${userId}/${toPath}/${uniqueFileName}`;
        copySource = copySource.replace(/\/+/g, "/");
        key = key.replace(/\/+/g, "/");
        await this.client.send(new CopyObjectCommand({ Bucket: this.bucket, CopySource: copySource, Key: key }));
        return uniqueFileName;
    }

    async getUniqueFileName(userId: string, path: string, filename: string, i = 0) {
        const exists = await this.isFileExists(userId, `${path}/${filename}`);
        if (!exists) return filename;
        return this.getUniqueFileName(userId, path, `${i}_${filename}`, i + 1);
    }

    async isFileExists(userId: string, key: string): Promise<boolean> {
        try {
            await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: `${userId}/${key}` }));
            return true;
        } catch (e) {
            if (e.name === "NotFound") return false;
            throw e;
        }
    }

    async putFile(userId: string, fromPath: string, filename: string, toPath: string) {
        const fileStream = fs.createReadStream(fromPath + filename);
        const key = `${userId}/${toPath}/${filename}`;
        await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: fileStream }));
        return filename;
    }

    async deleteFile(userId: string, path: string, fileName: string) {
        await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: `${userId}/${path}/${fileName}` }));
    }

    async getFileUrl(userId: string, path: string, filename: string) {
        const key = `${userId}/${path}/${filename}`;
        const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
        return await getSignedUrl(this.client, command, { expiresIn: 3600 });
    }

    async removeFromCompanyBucket(userId: string, path: string, oldValue: string) {
        await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: `${userId}/${path}${oldValue}` }));
        return { status: 'success', message: 'removed_successfully' };
    }

    public async getObjectFromS3(userId: string, path: string, fileName: string): Promise<Buffer> {
        const command = new GetObjectCommand({ Bucket: this.bucket, Key: `${userId}/${path}${fileName}` });
        const { Body } = await this.client.send(command);
        if (!Body) throw new Error('File not found');
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            let size = 0;
            const stream = Body as Readable;
            stream.on('data', chunk => { size += chunk.length; chunks.push(chunk); });
            stream.on('end', () => resolve(Buffer.concat(chunks, size)));
            stream.on('error', err => reject(err));
        });
    }

    async bucketList() {
        const data = await this.client.send(new ListBucketsCommand({}));
        return data.Buckets;
    }
}
