import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import { invalidUrl } from '../shared/configs/response.configs';
import { FusorRequest } from '../shared/@types/common.types';
import { CommonMiddleware } from '../shared/lib/middleware';
import { errorHandler } from '../shared/lib/response';
import controller from './admin.init';

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    const req: FusorRequest = { ...event, customValues: {} };
    const commonMiddleware = new CommonMiddleware(req);

    const method = event.httpMethod.toUpperCase();
    const [, path1, path2] = event.path.split('/');

    if (path1 !== 'admin') {
        return invalidUrl;
    }

    try {
        commonMiddleware.bodyParsor();
        if (method === 'PUT' && path2 === 'signup') {
        } else if (method === 'POST' && path2 === 'signin') {
        } else if (method === 'POST' && path2 === 'signout') {
        }
    } catch (err: Error | APIGatewayProxyResultV2 | any) {
        return errorHandler(err);
    }
    return invalidUrl;
};
