import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUsers} from '../../businessLogic/Users';
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all USERS for the Learning Portal
  
  logger.info('Processing event: ', event)
  
  const getItem = await getUsers(event);

  if (!(await getUsers(event))) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist'
      })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: getItem
    })
  }

}
