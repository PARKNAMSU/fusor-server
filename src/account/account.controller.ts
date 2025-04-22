import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import { AccountService } from './account.service';
import { SignUpRequestDto } from './account.dto';
import { invalidBody } from '../shared/configs/response.configs';

export class AccountController {
    service: AccountService;
    constructor(service: AccountService) {
        this.service = service;
    }
    async signUp(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> {
        try {
            if (event.body === null || event.pathParameters === null) {
                return invalidBody;
            }

            const data = await this.service.signUp({
                loginId: event.pathParameters.proxy as string,
                password: JSON.parse(event.body).password as string,
            });

            return {
                statusCode: 200,
                body: JSON.stringify({
                    data,
                }),
            };
        } catch (e) {
            throw e;
        }
    }
}
