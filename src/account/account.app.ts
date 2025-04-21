import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import controller from './account.init';
import { invalidUrl } from '../shared/configs/response.configs';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    let response: APIGatewayProxyResultV2;

    const method = event.httpMethod.toUpperCase();
    const [, path1, path2] = event.path.split('/');

    if (path1 !== 'account') {
        return invalidUrl;
    }

    try {
        if (method === 'PUT' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(path2)) {
            return controller.signUp(event);
        }
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
    return invalidUrl;
};
