import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as process from 'process';
import { Express } from 'express';

@Injectable()
export class AWSS3Service {
  AWS_S3_BUCKET = process.env.S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async upload(file: Express.Multer.File, key: string) {
    return this.s3_upload(file.buffer, this.AWS_S3_BUCKET, key, file.mimetype);
  }

  async delete(key: string) {
    return this.s3_delete(this.AWS_S3_BUCKET, key);
  }

  params = (file, bucket, name, mimetype) => ({
    Bucket: bucket,
    Key: String(name),
    Body: file,
    ACL: 'public-read',
    ContentType: mimetype,
    ContentDisposition: 'inline',
    CreateBucketConfiguration: {
      LocationConstraint: 'ap-south-1',
    },
  });

  async s3_upload(file, bucket, name, mimetype) {
    try {
      return await this.s3
        .upload(this.params(file, bucket, name, mimetype))
        .promise();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async s3_delete(bucket, name) {
    try {
      return await this.s3
        .deleteObject({
          Bucket: bucket,
          Key: String(name),
        })
        .promise();
    } catch (e) {
      console.log(e);
    }
  }
}
