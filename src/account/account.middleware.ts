import { APIGatewayProxyEvent } from 'aws-lambda';

export class AccountMiddleware {
    event: APIGatewayProxyEvent;
    constructor(event: APIGatewayProxyEvent) {
        this.event = event;
    }
    signUpRequestCheck() {
        try {
            const { body, pathParameters } = this.event;
            if (body === null || pathParameters === null) throw new Error('invalid request');
            const jsonBody = JSON.parse(body) as { [key: string]: any };
            if (typeof jsonBody.password !== 'string' || !pathParameters.proxy) throw new Error('invalid request');
        } catch (e) {
            throw e;
        }
    }
}
