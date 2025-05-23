import { TokenData } from '../shared/@types/account.types';
import { USER_SESSION_EXPIRED_PERIOD } from '../shared/configs/common.configs';
import { aleadyExist } from '../shared/configs/response.configs';
import { getSecretPasswordKey } from '../shared/configs/secret.configs';
import { generateHash } from '../shared/lib/authenticate';
import redis from '../shared/lib/redis';
import { generateResponse } from '../shared/lib/response';
import { AccountRepository } from '../shared/repository/\baccountRepository';
import { PlatformRepository } from '../shared/repository/platformRepository';
import {
    SignInRequestDto,
    SignInResponseDto,
    SignOutRequestDto,
    SignUpRequestDto,
    SignUpResponseDto,
} from './account.dto';
import { v4 as uuid } from 'uuid';

export class AccountService {
    accountRepository: AccountRepository;
    platformRepository: PlatformRepository;
    constructor(accountRepository: AccountRepository, platformRepository: PlatformRepository) {
        this.accountRepository = accountRepository;
        this.platformRepository = platformRepository;
    }
    async signUp(dto: SignUpRequestDto): Promise<SignUpResponseDto> {
        try {
            const { loginId, password } = dto;
            if (!!(await this.accountRepository.getByLoginId(loginId))) {
                throw aleadyExist;
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
    async signIn(dto: SignInRequestDto): Promise<SignInResponseDto> {
        try {
            const { loginId, password } = dto;

            const account = await this.accountRepository.getByLoginId(loginId);

            if (!account || account.password !== generateHash(password, getSecretPasswordKey())) {
                throw generateResponse({
                    code: 401,
                    data: {
                        code: 'NOT-MATCHING-ACCOUNT',
                        message: 'user auth info fail',
                    },
                });
            }

            const sessionId = uuid();
            const tokenData: TokenData = {
                ...account,
                platforms: await this.platformRepository.getList(account.id),
            };

            redis.set(`account:${sessionId}`, tokenData, {
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
    async signOut(dto: SignOutRequestDto) {
        try {
            const { password, sessionId, tokenData } = dto;
            console.log({
                password,
                sessionId,
                tokenDataId: tokenData.id,
            });

            const account = await this.accountRepository.getByLoginId(tokenData.loginId);

            if (!account || account?.password !== generateHash(password, getSecretPasswordKey())) {
                throw generateResponse({
                    code: 401,
                    data: {
                        code: 'NOT-MATCHING-ACCOUNT',
                        message: 'user auth info fail',
                    },
                });
            }
            await redis.delete(`account:${sessionId}`);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
