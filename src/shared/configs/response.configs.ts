import { APIGatewayProxyResultV2 } from 'aws-lambda';

export const invalidBody: APIGatewayProxyResultV2 = {
    statusCode: 400,
    body: JSON.stringify({
        message: 'sended invalid body',
        code: 'INVALID-BODY',
    }),
};

export const invalidUrl: APIGatewayProxyResultV2 = {
    statusCode: 404,
    body: JSON.stringify({
        message: 'invalid url',
        code: 'INVALID-URL',
    }),
};
