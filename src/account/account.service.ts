import { TokenData } from '../shared/@types/account.types';
import { USER_SESSION_EXPIRED_PERIOD } from '../shared/configs/common.configs';
import { getSecretPasswordKey } from '../shared/configs/secret.configs';
import { generateHash } from '../shared/lib/authenticate';
import { FusorDynamoDB } from '../shared/lib/dynamodb';
import redis from '../shared/lib/redis';
import { AccountRepository } from '../shared/repository/\baccountRepository';
import { PlatformRepository } from '../shared/repository/platformRepository';
import { SignInRequestDto, SignUpRequestDto, SignUpResponseDto } from './account.dto';
import { v4 as uuid } from 'uuid';

export class AccountService {
    accountRepository: AccountRepository;
    constructor(accountRepository: AccountRepository, platformRepository: PlatformRepository) {
        this.accountRepository = accountRepository;
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
    async signIn(dto: SignInRequestDto): Promise<SignUpResponseDto> {
        try {
            const { loginId, password } = dto;

            const account = await this.accountRepository.getByLoginId(loginId);

            if (!account || account.password !== generateHash(password, getSecretPasswordKey())) {
                throw 'NOT-MATCHING-ACCOUNT';
            }

            const sessionId = uuid();
            const tokenData: TokenData = {
                ...account,
                platforms: [], // todo: platform 리스트 가져오기 구현
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
}
