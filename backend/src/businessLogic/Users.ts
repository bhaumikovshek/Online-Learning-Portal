import 'source-map-support/register';
import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';

import UserDBAccessLayer from '../dataLayer/UserAccess';
import UserStorageLayer from '../dataLayer/UserStorage';
import { getAdminId } from '../lambda/utils';
import { CreateUserRequest } from '../requests/CreateUserRequest';
import { UpdateUserRequest } from "../requests/UpdateUserRequest";
import { UserItem } from '../models/UserCreate';

const userAccessLayer = new UserDBAccessLayer();
const userStorageLayer = new UserStorageLayer();

export async function createUser(event: APIGatewayProxyEvent,
                                 createuserRequest: CreateUserRequest): Promise<UserItem> {
  const userId = uuid.v4();
  const adminId = getAdminId(event);
  const createdAt = new Date(Date.now()).toISOString();

  const userItem = {
    adminId,
    userId,
    createdAt,
    attachmentUrl: `https://${userStorageLayer.getBucketName()}.s3.amazonaws.com/${userId}`,
    ...createuserRequest
  };

  await userAccessLayer.addUser(userItem);

  return userItem;
}

export async function getUser(event: APIGatewayProxyEvent) {
  const userId = event.pathParameters.userId;
  const adminId = getAdminId(event);

  return await userAccessLayer.getUser(userId, adminId);
}

export async function getUsers(event: APIGatewayProxyEvent) {
  const adminId = getAdminId(event);

  return await userAccessLayer.getAllUsers(adminId);
}

export async function updateUser(event: APIGatewayProxyEvent,
                                 updateUserRequest: UpdateUserRequest) {
  const userId = event.pathParameters.userId;
  const adminId = getAdminId(event);

  if (!(await userAccessLayer.getUser(userId, adminId))) {
    return false;
  }

  await userAccessLayer.updateUser(userId, adminId, updateUserRequest);

  return true;
}

export async function deleteUser(event: APIGatewayProxyEvent) {
  const userId = event.pathParameters.userId;
  const adminId = getAdminId(event);

  if (!(await userAccessLayer.getUser(userId, adminId))) {
    return false;
  }

  await userAccessLayer.deleteUser(userId, adminId);

  return true;
}

export async function generateUploadUrl(event: APIGatewayProxyEvent) {
  const bucket = userStorageLayer.getBucketName();
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
  const userId = event.pathParameters.userId;

  const createSignedUrlRequest = {
    Bucket: bucket,
    Key: userId,
    Expires: urlExpiration
  }

  return userStorageLayer.getPresignedUploadURL(createSignedUrlRequest);
}
