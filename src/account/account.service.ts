import { TokenData } from '../shared/@types/account.types';
import { USER_SESSION_EXPIRED_PERIOD } from '../shared/configs/common.configs';
import { FusorDynamoDB } from '../shared/lib/dynamodb';
import redis from '../shared/lib/redis';
import { AccountRepository } from '../shared/repository/\baccountRepository';
import { SignUpResponseDto } from './account.dto';
import { v4 as uuid } from 'uuid';

export class AccountService {
    accountRepository: AccountRepository;
    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository;
    }
    async signUp(loginId: string, password: string): Promise<SignUpResponseDto> {
        try {
            if (!!(await this.accountRepository.get({ loginId }))) {
                throw new Error('exist');
            }

            const data = await this.accountRepository.create({ loginId, password });
            await this.accountRepository.db.writeTransaction();

            const tokenData: TokenData = {
                ...data,
                platforms: [],
            };

            const sessionId = uuid();

            redis.set(sessionId, tokenData, {
                sync: false,
                ttl: USER_SESSION_EXPIRED_PERIOD,
            });

            return {
                sessionId,
                loginId,
            };
        } catch (e) {
            throw e;
        }
    }
}
