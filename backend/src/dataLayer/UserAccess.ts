import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export default class UserDBAccessLayer {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly usersTable = process.env.USERS_TABLE,
    private readonly indexName = process.env.INDEX_NAME
  ) { }

  async addUser(userItem) {
    await this.docClient.put({
      TableName: this.usersTable,
      Item: userItem
    }).promise();
  }

  async deleteUser(userId, adminId) {
    await this.docClient.delete({
      TableName: this.usersTable,
      Key: {
        userId,
        adminId
      }
    }).promise();
  }

  async getUser(userId, adminId) {
    const result = await this.docClient.get({
      TableName: this.usersTable,
      Key: {
        userId,
        adminId
      }
    }).promise();

    return result.Item;
  }

  async getAllUsers(adminId) {
    const result = await this.docClient.query({
      TableName: this.usersTable,
      IndexName: this.indexName,
      KeyConditionExpression: 'adminId = :adminId',
      ExpressionAttributeValues: {
        ':adminId': adminId
      }
    }).promise();

    return result.Items;
  }

  async updateUser(userId, adminId, updatedUser) {
    await this.docClient.update({
      TableName: this.usersTable,
      Key: {
        userId,
        adminId
      },
      UpdateExpression: 'set #name = :n, #expDate = :due, #done = :d',
      ExpressionAttributeValues: {
        ':n': updatedUser.name,
        ':due': updatedUser.expDate,
        ':d': updatedUser.done
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#expDate': 'expDate',
        '#done': 'done'
      }
    }).promise();
  }
}
