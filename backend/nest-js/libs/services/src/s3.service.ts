import {  Injectable } from '@nestjs/common';
import {  S3Client, PutObjectCommandInput, CreateBucketCommand, HeadBucketCommand, GetObjectCommand, DeleteObjectCommand, CopyObjectCommand, PutObjectCommand, HeadObjectCommand, GetObjectCommandInput, ListBucketsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import * as sharp from 'sharp';
import { Upload } from '@aws-sdk/lib-storage';
// import { resHeader } from '../helpers/file';
import * as fs from 'fs';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);
@Injectable()
export class S3Service {
    client: any;
    bucket = process.env.S3_MAIN_BUCKET;
    masterBucket = process.env.BUCKET_MASTER;

    constructor() {
        const accessKeyId = process.env.AWS_S3_KEY;
        const secretAccessKey = process.env.AWS_S3_SECRET;
        
        if (!accessKeyId || !secretAccessKey) {
            throw new Error("AWS credentials are not set in environment variables");
        }
        
        this.client = new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region: 'eu-central-1',
        });

    }

    async setBucketName(name: any) {
        this.bucket = name;
    }

    async createBucketIfNotExists(bucketName) {
        return true;
        // currently we dont need this function
        if (!await this._doesBucketExist(bucketName)) {

            const params = { Bucket: bucketName };

            try {
                const data = await this.client.send(new CreateBucketCommand(params));
                return { message: "bucket_created_sucessfully" }
            } catch (err) {
                console.error(err, "<-------error");
            }
        }

        return { message: "bucket_already_exist" }

    }
    
    async upload(file: Buffer | string, companyId: string, toPath: string, filename: string, mimetype: string) {
        try {
            // Convert image files to buffer using Sharp
            if (["image/jpeg", "image/png", "image/heic"].includes(mimetype)) {
                file = await sharp(file).toBuffer();
            }
         
            // Construct the S3 key
            const keySource = companyId
                ? `companies/${companyId}/${toPath}/${filename}`
                : `${toPath}/${filename}`;
    
            // S3 Upload parameters
            const params: PutObjectCommandInput = {
                Bucket: this.bucket,
                Key: keySource,
                Body: file,
                ACL: "public-read",
                ContentType: mimetype,
                ContentDisposition: "inline",
            };
    
            // Upload to S3
            const upload = new Upload({
                client: this.client,
                params,
            });
    
            const s3Response = await upload.done();
    
            console.log(`File uploaded successfully`);
            
            return s3Response;
        } catch (error) {
            console.error("S3 Upload Error:", error);
            throw new Error("File upload failed");
        }
    }
    


    async getFileAsResponse(response, companyId, path, fileName, useSharp = false, thumbScale: any = false, extension = null) {

        try {

            let key = companyId === 'master' ? `master/${String(path)}/${fileName}` : `companies/${companyId}/${String(path)}/${fileName}`;
            let bucket = this.bucket;

            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            const data = await this.client.send(command);

            if (useSharp) {
                const chunks = [];

                data.Body.on('data', chunk => {
                    // chunks.push(chunk);
                });

                data.Body.on('end', async () => {
                    const buffer = Buffer.concat(chunks);
                    const processedImage = await sharp(buffer)
                        // .resize({ width: 'micro', height: constants.thumbScale[thumbScale] })
                        .toBuffer();
                    // response = resHeader('image/jpeg', response);
                    response.send(processedImage);
                });

                data.Body.on('error', err => {
                    console.error(err.message);
                    response.status(500).send('Error: 500 - Internal Server Error');
                });
            } else {
                // response = resHeader(data.ContentType, response);
                data.Body.pipe(response);
            }
        } catch (err) {
            console.error(err.message);
            response.status(404).send('Error: 404 - Not found');
        }

    }

    async copyFile(companyId: string, fromPath: string, filename: string, toPath: string) {
        await this.createBucketIfNotExists(this.bucket);
        // Ensure unique filename at the destination
        const uniqueFileName = await this.getUniqueFileName(
            this.bucket,
            `companies/${companyId}/${toPath}`,
            filename
        );

        // Properly encode CopySource to avoid invalid header issues
        let copySource = encodeURIComponent(`${this.bucket}/companies/${companyId}/${fromPath}/${filename}`);
        let key = `companies/${companyId}/${toPath}/${uniqueFileName}`; // Only object path, no bucket
        copySource = copySource.replace(/\/+/g, "/");
        key = key.replace(/\/+/g, "/");
        await this.client.send(new CopyObjectCommand({
            Bucket: this.bucket,
            CopySource: copySource, // MUST be encoded
            Key: key,
        }));

        return uniqueFileName;
    }


    async getUniqueFileName(companyId, path, filename, i = 0) {
        // isFileExists - checks if the file already exists at s3 bucket
        let isFileExists = await this.isFileExists(companyId, path + filename);
        if (!isFileExists) {
            return filename;
        } else {
            filename = i + '_' + filename;
            return await this.getUniqueFileName(companyId, path, filename, i++);
        }
    }

    async isFileExists(companyId: string, key: string): Promise<boolean> {

        try {
            const bucket = this.bucket
            await this.client.send(new HeadObjectCommand({ Bucket: bucket, Key: 'companies/' + companyId + '/' + key }));
            return true;
        } catch (e) {
            if (e.name === "NotFound") {
                return false;
            }
            throw e;
        }
    }

    async putFile(companyId: string, fromPath: string, filename: string, toPath: string) {
        try {
            const fileStream = fs.createReadStream(fromPath + filename);
            const key = 'companies/' + companyId + '/' + toPath + filename;
            const params = {
                Bucket: this.bucket,
                Key: key,
                Body: fileStream,
            };
            const command = new PutObjectCommand(params);
            await this.client.send(command);
            return filename;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }



    async deleteFile(companyId: string, path: string, fileName: string): Promise<void> {
        const bucket = this.bucket;
        const params = {
            Bucket: bucket,
            Key: 'companies/' + companyId + '/' + path + '/' + fileName,
        };

        const command = new DeleteObjectCommand(params);

        try {
            await this.client.send(command);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }


    async getFileUrl(companyId: string, path: string, filename: string): Promise<string> {
        try {
            const params: GetObjectCommandInput = {
                Bucket: this.bucket,
                Key: `companies/${companyId}/${path}/${filename}`,
            };

            const command = new GetObjectCommand(params);
            const fileUrl = await getSignedUrl(this.client, command, { expiresIn: 3600 }); // URL expires in 1 hour

            return fileUrl;
        } catch (error) {
            console.error('Error generating presigned URL:', error);
            throw error;
        }
    }

    async removeFromCompanyBucket(companyId: string, actualPath: string, oldValue: string): Promise<{ status: string; message: string }> {
        try {

            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: `companies/${companyId}/${actualPath}${oldValue}`,
            });

            await this.client.send(command);

            return {
                status: 'success',
                message: 'removed_successfully',
            };
        } catch (error) {
            console.error('Error removing object from S3:', error);
            throw error;
        }
    }

    public async getObjectFromS3(companyId: string, path: string, fileName: string): Promise<Buffer> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: 'companies/' + companyId + '/' + path + fileName,
            });

            const { Body } = await this.client.send(command);

            if (!Body) {
                throw new Error('File not found or empty response');
            }

            return new Promise<Buffer>((resolve, reject) => {
                const chunks: Uint8Array[] = [];
                let size = 0;

                const stream = Body as Readable;
                stream.on('data', (chunk) => {
                    size += chunk.length;
                    chunks.push(chunk);
                });

                stream.on('end', () => {
                    console.log('End. Total size = ' + size);
                    resolve(Buffer.concat(chunks, size));
                });

                stream.on('error', (err) => {
                    console.error('Error reading S3 stream:', err);
                    reject(err);
                });
            });

        } catch (error) {
            console.error('Error downloading file from S3:', error);
            throw error;
        }
    }








    /**
* this function used to check the bucket is already exists in s3
* 
* @author Sashanth GV <sashanath@sodisys.io>
* 
* @param bucketName         string          s3 bucketname with company id
* 
* @returns                  object           success message
*/
    private async _doesBucketExist(bucketName) {
        try {
            const command = new HeadBucketCommand({ Bucket: bucketName });
            await this.client.send(command);
            return true;
        } catch (error) {
            if (error.name === 'NotFound') {
                return false;
            }
            throw error;
        }
    }


    async bucketList() {
        try {
            console.log("Listing buckets...");

            const data = await this.client.send(new ListBucketsCommand({}));
            console.log("Buckets:", data.Buckets);
            return data.Buckets;
        } catch (error) {
            console.error("S3 Error:", error);
        }
    }

}

