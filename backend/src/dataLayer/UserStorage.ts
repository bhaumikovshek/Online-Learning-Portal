import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

export default class UserStorageLayer {
  constructor(
    private readonly usersStorage = process.env.S3_BUCKET,
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' })
  ) { }

  getBucketName() {
    return this.usersStorage;
  }

  getPresignedUploadURL(createSignedUrlRequest: CreateSignedURLRequest) {
    return this.s3.getSignedUrl('putObject', createSignedUrlRequest);
  }
}
