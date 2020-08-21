import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateUserRequest } from '../../requests/CreateUserRequest'
import { createUser } from '../../businessLogic/Users';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newUser: CreateUserRequest = JSON.parse(event.body)
  
  const userItem = await createUser(event, newUser);

  if (!newUser.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'name is empty'
      })
    };
  }

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: userItem
    })
  };

}
