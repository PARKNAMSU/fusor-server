import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import { FusorRequest } from '../shared/@types/common.types';
import { CommonMiddleware } from '../shared/lib/middleware';
import { invalidUrl } from '../shared/configs/response.configs';
import { errorHandler } from '../shared/lib/response';
import { domainCheck } from '../shared/lib/common';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    try {
        const req: FusorRequest = { ...event, customValues: {} };
        const commonMiddleware = new CommonMiddleware(req);

        const method = event.httpMethod.toUpperCase();
        const [, path1, path2, path3] = event.path.split('/');

        if (path1 !== 'platform') {
            return invalidUrl;
        }

        if (method === 'PUT' && path2 === 'request' && domainCheck(path3)) {
        } else if (method === 'GET' && domainCheck(path2)) {
        } else if (method === 'POST' && path2 === 'accept') {
        } else if (method === 'DELETE' && domainCheck(path2)) {
        } else if (method === 'PATCH' && domainCheck(path2)) {
        }
    } catch (err) {
        return errorHandler(err);
    }

    return invalidUrl;
};
