import { APIGatewayProxyEvent } from 'aws-lambda';

export interface FusorRequest extends APIGatewayProxyEvent {
    customValues: {
        [k: string]: any;
    };
}
