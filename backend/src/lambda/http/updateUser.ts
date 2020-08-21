import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { updateUser }  from '../../businessLogic/Users';
import { UpdateUserRequest } from "../../requests/UpdateUserRequest";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const updatedUser: UpdateUserRequest = JSON.parse(event.body);

  const updated = await updateUser(event, updatedUser);
  if (!updated) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'User does not exist'
      })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
