import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import controller from './account.init';
import { invalidUrl } from '../shared/configs/response.configs';
import { AccountMiddleware } from './account.middleware';
import { FusorRequest } from '../shared/@types/common.types';
import { CommonMiddleware } from '../shared/lib/middleware';
import { errorHandler } from '../shared/lib/response';

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    const req: FusorRequest = { ...event, customValues: {} };
    const middleware = new AccountMiddleware(req);
    const commonMiddleware = new CommonMiddleware(req);

    const method = event.httpMethod.toUpperCase();
    const [, path1, path2] = event.path.split('/');

    if (path1 !== 'account') {
        return invalidUrl;
    }

    try {
        if (method === 'PUT' && path2 === 'signup') {
            middleware.signUpRequestCheck();
            commonMiddleware.bodyParsor();
            return await controller.signUp(req);
        } else if (method === 'POST' && path2 === 'signin') {
            middleware.signInRequestCheck();
            commonMiddleware.bodyParsor();
            return await controller.signIn(req);
        } else if (method === 'POST' && path2 === 'signout') {
            middleware.signOutRequestCheck();
            commonMiddleware.bodyParsor();
            await commonMiddleware.accountValidation();
            return await controller.signOut(req);
        }
    } catch (err: Error | APIGatewayProxyResultV2 | any) {
        return errorHandler(err);
    }
    return invalidUrl;
};
