import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    console.log(event);
    const message = Object.keys(event).join(",")
    let response: APIGatewayProxyResultV2;
    try {
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message:  message,
            }),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }

    return response;
};