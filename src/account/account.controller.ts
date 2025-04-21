import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from 'aws-lambda';
import { AccountService } from './account.service';
import { bodyParsor } from '../shared/lib/common';
import { SignUpRequestDto } from './account.dto';
import { invalidBody } from '../shared/configs/response.configs';

export class AccountController {
    service: AccountService;
    constructor(service: AccountService) {
        this.service = service;
    }
    async signUp(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> {
        try {
            const body = bodyParsor<SignUpRequestDto>(event.body);
            if (!body) {
                return invalidBody;
            }
            const data = await this.service.signUp(body.loginId, body.password);
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
