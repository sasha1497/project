import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
// import { isSupportedFormat, resHeader } from '../helpers/file';
const Minio = require('minio');

@Injectable()
export class MinioService {
    client: any;
    bucket = process.env.BUCKET_PREFIX;
    masterBucket = process.env.BUCKET_MASTER;



    constructor() {

        const Minio = require('minio')
        let value = process.env.S3_SSL == "1";
        let minioClient = {
            endPoint: process.env.MINIO_S3_ENDPOINT,
            useSSL: value,
            accessKey: process.env.MINIO_S3_KEY,
            secretKey: process.env.MINIO_S3_SECRET
        }
        if (!value) {
            minioClient['port'] = 9000;
        }

        this.client = new Minio.Client(minioClient);
    }


    async upload(file, toPath, fileName, mimetype, id) {

        const metaData = { 'Content-Type': mimetype };

        const bucket = this.bucket;

        return new Promise((resolve, reject) => {
            this.client.putObject(bucket, toPath + '/' + id + '/' + fileName, file, metaData, (err, etag) => {
                if (err) return reject(err);
                resolve(toPath + '/' + fileName);
            });
        });
    }

    async getSignedUrl(filePath: string): Promise<string> {
        console.log(filePath,"<---file path");
        
        const bucket = this.bucket;
        return new Promise((resolve, reject) => {
            this.client.presignedGetObject(bucket, filePath, 24 * 60 * 60, (err, url) => {
                if (err) return reject(err);
                resolve(url);
            });
        });
    }



    async createBucketIfNotExists(companyId) {
        const bucketName = this.bucket + companyId;
        const exists = await this.client.bucketExists(bucketName);
        if (!exists) {
            await this.client.makeBucket(bucketName);
        }
    }

    async getFileAsResponse(response, companyId, path, fileName, useSharp = false, thumbScale: any = false, extension = null) {

        try {

            let key = `${String(path)}/${fileName}`;
            let bucket = companyId === 'master' ? this.masterBucket : this.bucket + companyId;
            const stat = await this.client.statObject(bucket, key);

            this.client.getObject(bucket, key, async (err, dataStream) => {
                if (err) {
                    console.error(err.message);
                    response.status(404).send('Error: 404 - Not found');
                    return;
                }

                dataStream.on('error', (streamErr) => {
                    console.error(streamErr.message);
                    response.status(500).send('Error: 500 - Internal Server Error');
                });

                if (!extension) {
                    const fileNameStr = fileName ? String(fileName) : "";
                    // extension = fileNameStr.split('.').pop()?.toLowerCase() || null;
                }
                // useSharp = extension ? isSupportedFormat(extension) : false;

                if (useSharp) {
                    const chunks = [];
                    dataStream.on('data', chunk => {
                        // chunks.push(chunk);
                    });

                    dataStream.on('end', async () => {
                        const buffer = Buffer.concat(chunks);
                        // const processedImage = await sharp(buffer)
                        // .resize({ width: constants.thumbScale[thumbScale], height: constants.thumbScale[thumbScale] })
                        //     .toBuffer();
                        // // response = resHeader('image/jpeg', response);
                        // response.send(processedImage);
                    });
                } else {
                    // response = resHeader(stat.metaData['content-type'], response);
                    dataStream.pipe(response);
                }
            });
        } catch (err) {
            console.error(err.message);
            response.status(404).send('Error: 404 - Not found');
        }
    }

    async copyFile(companyId: string, fromPath: string, filename: string, toPath: string) {
        const bucketName = companyId === 'master' ? this.masterBucket : this.bucket + companyId;
        await this.createBucketIfNotExists(bucketName);
        const uniqueFileName = await this.getUniqueFileName(bucketName, toPath, filename);
        const copySource = bucketName + '/' + fromPath + '/' + filename;
        toPath = toPath.replace(/\/+/g, "/");
        fromPath = fromPath.replace(/\/+/g, "/");
        await this.client.copyObject(bucketName, toPath + '/' + uniqueFileName, copySource);

        return uniqueFileName;
    }

    async getUniqueFileName(companyId, path, filename, i = 0) {
        const bucket = this.bucket + companyId
        // isFileExists - checks if the file already exists at s3 bucket
        let isFileExists = await this.isFileExists(bucket, path + filename);
        if (!isFileExists) {
            return filename;
        } else {
            filename = i + '_' + filename;
            return await this.getUniqueFileName(bucket, path, filename, i++);
        }
    }


    async isFileExists(companyId, key) {
        try {
            const stat = await this.client.statObject(this.bucket + companyId, key)
            return stat;
        } catch (e) {
            return false;
        }
    }

    public async deleteFile(companyId: string, path: string, fileName: string): Promise<void> {
        try {
            const bucket = companyId === 'master' ? this.masterBucket : this.bucket + companyId;
            await this.client.removeObject(bucket, path + '/' + fileName);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    async putFile(companyId: string, fromPath: string, filename: string, toPath: string) {

        const bucketName = this.bucket + companyId;
        // S3 Bucket Creation
        await this.createBucketIfNotExists(bucketName);
        // getUniqueFileName - checks for the file has unique name
        let uniqueFileName = await this.getUniqueFileName(bucketName, toPath, filename);
        // fPutObject - move the object to the s3 bucket 
        await this.client.fPutObject(bucketName, toPath + uniqueFileName, fromPath + filename);

        return uniqueFileName;

    }

    async getFileUrl(companyId, path, filename) {
        let fileUrl = await this.client.presignedUrl('GET', this.bucket + companyId, path + '/' + filename);
        return fileUrl;
    }

    async removeFromCompanyBucket(companyId, actualPath, oldValue) {
        try {
            await this.client.removeObject(this.bucket + companyId, actualPath + oldValue)
            return {
                status: "success",
                message: "removed_successfully",
            }
        } catch (error) {
            throw error;
        }
    }


    public async getObjectFromS3(companyId: string, path: string, fileName: string) {
        try {
            let size = 0;
            const chunks = [];

            const bucket = companyId === 'master' ? this.masterBucket : this.bucket + companyId;

            return new Promise(async (resolve, reject) => {
                try {
                    // Downloads an object as a stream from s3
                    const dataStream = await this.client.getObject(bucket, path + fileName);

                    dataStream.on('data', function (chunk) {
                        size += chunk.length;
                        // chunks.push(chunk);
                    });

                    dataStream.on('end', function () {
                        console.log('End. Total size = ' + size);
                        const buffer = Buffer.concat(chunks, size);
                        resolve(buffer);
                    });

                    //handles the error
                    dataStream.on('error', function (err) {
                        console.log(err);
                        reject(err);
                    });

                    return resolve;
                } catch (error) {
                    console.log('Error downloading file:', error);
                    reject(error);
                }
            });
        } catch (error) {
            throw error;
        }
    }



}