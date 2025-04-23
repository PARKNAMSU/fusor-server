import { APIGatewayProxyResultV2 } from 'aws-lambda';

export function generateResponse<T>({
    code = 200,
    data,
    headers,
}: {
    code: number;
    data: T;
    headers?: {
        [k: string]: string;
    };
}): APIGatewayProxyResultV2 {
    try {
        return {
            statusCode: code,
            body: JSON.stringify(data),
            headers,
        };
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export function errorHandler(err: Error | APIGatewayProxyResultV2 | any): APIGatewayProxyResultV2 {
    let response: APIGatewayProxyResultV2;
    console.trace('here3');
    response = {
        statusCode: 500,
        body: JSON.stringify({
            message: 'some error happened',
        }),
    };
    if (err instanceof Error) {
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message,
            }),
        };
    } else if (typeof err === 'object' && 'statusCode' in err && 'body' in err) {
        response = err as APIGatewayProxyResultV2;
    }
    return response;
}
