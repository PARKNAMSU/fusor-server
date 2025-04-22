import { APIGatewayProxyEvent } from 'aws-lambda';
import { emailCheck, passwordCheck } from '../shared/lib/common';
import { generateResponse } from '../shared/lib/response';
import { invalidBody, invalidLoginId, invalidPassword } from '../shared/configs/response.configs';
import { FusorRequest } from '../shared/@types/common.types';

export class AccountMiddleware {
    event: FusorRequest;
    constructor(event: FusorRequest) {
        this.event = event;
    }
    signUpRequestCheck() {
        try {
            const { body } = this.event;
            if (body === null) throw invalidBody;
            const jsonBody = JSON.parse(body) as { [key: string]: any };
            if (typeof jsonBody.loginId !== 'string' || !emailCheck(jsonBody.loginId)) throw invalidLoginId;
            if (typeof jsonBody.password !== 'string' || !passwordCheck(jsonBody.password)) throw invalidPassword;
        } catch (e) {
            throw e;
        }
    }
    signInRequestCheck() {
        try {
            this.signUpRequestCheck();
        } catch (e) {
            throw e;
        }
    }
    signOutRequestCheck() {
        try {
            const { body } = this.event;
            if (body === null) throw invalidBody;
            const jsonBody = JSON.parse(body) as { [key: string]: any };
            if (typeof jsonBody.password !== 'string' || !passwordCheck(jsonBody.password)) throw invalidPassword;
        } catch (e) {
            throw e;
        }
    }
}
