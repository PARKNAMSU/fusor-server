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

export const notExistAccount: APIGatewayProxyResultV2 = {
    statusCode: 401,
    body: JSON.stringify({
        message: 'not exist account',
        code: 'NOT-EXIST-ACCOUNT',
    }),
};

export const invalidPassword: APIGatewayProxyResultV2 = {
    statusCode: 401,
    body: JSON.stringify({
        message: 'invalid password',
        code: 'INVALID-PASSWORD',
    }),
};

export const invalidLoginId: APIGatewayProxyResultV2 = {
    statusCode: 401,
    body: JSON.stringify({
        code: 'INVALID-EMAIL',
        message: 'invalid email',
    }),
};

export const adminValidationFail: APIGatewayProxyResultV2 = {
    statusCode: 401,
    body: JSON.stringify({
        code: 'INVALID-ADMIN',
        message: 'invalid admin',
    }),
};
