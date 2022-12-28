import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils';

import { removeImageAttachment } from '../../helpers/attachmentUtils'
import { TodoAccess } from '../../dataLayer/todosAcess'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payload = JSON.parse(event.body)
    const { todoId, s3Key } = payload;
    const userId: string = getUserId(event);
    // Remove Image from S3 bucket
    await removeImageAttachment(s3Key);
    const aTodoAccess = new TodoAccess();
    await aTodoAccess.removeImageAttachment(userId, todoId);

    return {
      statusCode: 200,
      body: JSON.stringify({})
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors(
      {
        origin: "*",
        credentials: true,
      }
    )
  )
