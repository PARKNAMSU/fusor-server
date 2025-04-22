import { TokenData } from '../shared/@types/account.types';
import { USER_SESSION_EXPIRED_PERIOD } from '../shared/configs/common.configs';
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
            // todo: getItem 을 통한 검색은 primary key 를 통해서만 가능. gsi 사용 시 query 로 변경
            if (!!(await this.accountRepository.getByLoginId(loginId))) {
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
    async signOut(dto: SignOutRequestDto): Promise<string> {
        try {
            const { password, sessionId, tokenData } = dto;
            const account = await this.accountRepository.getByLoginId(tokenData.loginId);
            if (!account || account.password !== generateHash(password, getSecretPasswordKey())) {
                throw generateResponse({
                    code: 401,
                    data: {
                        code: 'NOT-MATCHING-ACCOUNT',
                        message: 'user auth info fail',
                    },
                });
            }
            await redis.delete(sessionId);
            return 'out';
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
