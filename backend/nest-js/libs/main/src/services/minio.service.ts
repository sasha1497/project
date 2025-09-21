import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import * as fs from 'fs';

@Injectable()
export class MinioService {
    client: any;
    bucket = process.env.BUCKET_PREFIX;
    masterBucket = process.env.BUCKET_MASTER;

    constructor() {
        const useSSL = process.env.S3_SSL === "1";

        if (!process.env.MINIO_S3_ENDPOINT) {
            throw new Error("MINIO_S3_ENDPOINT environment variable is not set");
        }

        this.client = new Minio.Client({
            endPoint: process.env.MINIO_S3_ENDPOINT, // guaranteed string
            port: useSSL ? undefined : 9000,
            useSSL,
            accessKey: process.env.MINIO_S3_KEY || "",
            secretKey: process.env.MINIO_S3_SECRET || ""
        });

    }

    async upload(file, toPath, fileName, mimetype, userId) {
        const metaData = { 'Content-Type': mimetype };
        return new Promise((resolve, reject) => {
            this.client.putObject(this.bucket, `${userId}/${toPath}/${fileName}`, file, metaData, (err, etag) => {
                if (err) return reject(err);
                resolve(`${userId}/${toPath}/${fileName}`);
            });
        });
    }

    async getSignedUrl(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.presignedGetObject(this.bucket, filePath, 24 * 60 * 60, (err, url) => {
                if (err) return reject(err);
                resolve(url);
            });
        });
    }

    async getFileAsResponse(response, userId, path, fileName) {
        const key = `${userId}/${path}/${fileName}`;
        this.client.getObject(this.bucket, key, (err, stream) => {
            if (err) return response.status(404).send('Not found');
            stream.pipe(response);
        });
    }

    async copyFile(userId: string, fromPath: string, filename: string, toPath: string) {
        const copySource = `${this.bucket}/${userId}/${fromPath}/${filename}`;
        const key = `${userId}/${toPath}/${filename}`;
        await this.client.copyObject(this.bucket, key, copySource);
        return filename;
    }

    async putFile(userId: string, fromPath: string, filename: string, toPath: string) {
        await this.client.fPutObject(this.bucket, `${userId}/${toPath}/${filename}`, `${fromPath}${filename}`);
        return filename;
    }

    async deleteFile(userId: string, path: string, fileName: string) {
        await this.client.removeObject(this.bucket, `${userId}/${path}/${fileName}`);
    }

    async getFileUrl(userId: string, path: string, filename: string) {
        return await this.getSignedUrl(`${userId}/${path}/${filename}`);
    }

    async removeFromCompanyBucket(userId: string, path: string, oldValue: string) {
        await this.client.removeObject(this.bucket, `${userId}/${path}${oldValue}`);
        return { status: "success", message: "removed_successfully" };
    }

    async isFileExists(userId: string, key) {
        try {
            await this.client.statObject(this.bucket, `${userId}/${key}`);
            return true;
        } catch (e) {
            return false;
        }
    }

    public async getObjectFromS3(userId: string, path: string, fileName: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.client.getObject(this.bucket, `${userId}/${path}${fileName}`, (err, stream) => {
                if (err) return reject(err);
                const chunks: Buffer[] = [];
                stream.on('data', chunk => chunks.push(chunk));
                stream.on('end', () => resolve(Buffer.concat(chunks)));
                stream.on('error', e => reject(e));
            });
        });
    }
}
