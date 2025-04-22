import { TokenData } from '../@types/account.types';
import { FusorRequest } from '../@types/common.types';
import { notExistAccount } from '../configs/response.configs';
import { cookieParsor } from './common';
import redis from './redis';
import { generateResponse } from './response';

export class CommonMiddleware {
    event: FusorRequest;
    constructor(event: FusorRequest) {
        this.event = event;
    }
    async accountValidation() {
        try {
            const cookieHeader = this.event.headers['Cookie'];
            if (!cookieHeader) throw notExistAccount;

            const cookies = cookieParsor(cookieHeader);

            const tokenData = await redis.get<TokenData>(cookies['session_id']);

            if (!tokenData) throw notExistAccount;

            this.event.customValues['tokenData'] = tokenData;
        } catch (e) {
            throw e;
        }
    }
    bodyParsor() {
        try {
            if (!this.event.body) {
                return;
            }
            this.event.customValues = {
                ...this.event.customValues,
                ...JSON.parse(this.event.body),
            };
        } catch (e) {
            throw e;
        }
    }
}
