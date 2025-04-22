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
    return {
        statusCode: code,
        body: JSON.stringify(data),
        headers,
    };
}
