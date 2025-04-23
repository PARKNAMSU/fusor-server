import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { AccountService } from './account.service';
import { invalidBody } from '../shared/configs/response.configs';
import { generateResponse } from '../shared/lib/response';
import { FusorRequest } from '../shared/@types/common.types';

export class AccountController {
    service: AccountService;
    constructor(service: AccountService) {
        this.service = service;
    }
    async signUp(event: FusorRequest): Promise<APIGatewayProxyResultV2> {
        try {
            const { loginId, password } = event.customValues;

            const data = await this.service.signUp({
                loginId: loginId as string,
                password: password as string,
            });

            return generateResponse({
                code: 201,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `sessionId=${data.sessionId}; Path=/; HttpOnly; Secure; SameSite=None`,
                    'Access-Control-Allow-Origin': 'https://example.com',
                    'Access-Control-Allow-Credentials': 'true',
                },
            });
        } catch (e) {
            throw e;
        }
    }
    async signIn(event: FusorRequest): Promise<APIGatewayProxyResultV2> {
        try {
            const { loginId, password } = event.customValues;
            const data = await this.service.signIn({
                loginId: loginId as string,
                password: password as string,
            });
            return generateResponse({
                code: 200,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `sessionId=${data.sessionId}; Path=/; HttpOnly; Secure; SameSite=None`,
                    'Access-Control-Allow-Origin': 'https://example.com',
                    'Access-Control-Allow-Credentials': 'true',
                },
            });
        } catch (e) {
            throw e;
        }
    }
    async signOut(event: FusorRequest): Promise<APIGatewayProxyResultV2> {
        try {
            if (event.body === null) {
                return invalidBody;
            }
            const { password, tokenData, sessionId } = event.customValues;

            await this.service.signOut({
                password,
                tokenData,
                sessionId,
            });

            return generateResponse({
                code: 200,
                data: {
                    message: 'out',
                },
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}
