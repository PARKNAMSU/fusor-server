import { v4 } from 'uuid';
import { AdminAccount } from '../shared/@types/admin.types';
import { ADMIN_SESSION_EXPIRED_PERIOD, fusorDayjs, SERVER_TIME_FORMAT_DEFAULT } from '../shared/configs/common.configs';
import { aleadyExist } from '../shared/configs/response.configs';
import redis from '../shared/lib/redis';
import { AdminRepository } from '../shared/repository/adminRepository';
import { AdminSignUpRequestDto } from './admin.dto';

export class AdminService {
    adminRepository: AdminRepository;
    constructor(adminRepository: AdminRepository) {
        this.adminRepository = adminRepository;
    }
    async signUp(dto: AdminSignUpRequestDto): Promise<{
        sessionId: string;
        loginId: string;
    }> {
        try {
            if (!!(await this.adminRepository.get(dto.loginId))) {
                throw aleadyExist;
            }

            const admin: AdminAccount = {
                ...dto,
                createdAt: fusorDayjs().utc().format(SERVER_TIME_FORMAT_DEFAULT),
            };
            await this.adminRepository.create(admin);

            const sessionId = v4();

            await redis.set(`admin:${sessionId}`, admin, {
                sync: true,
                ttl: ADMIN_SESSION_EXPIRED_PERIOD,
            });

            this.adminRepository.db.writeTransaction();

            return {
                sessionId,
                loginId: dto.loginId,
            };
        } catch (e) {
            throw e;
        }
    }
    async signIn(loginId: string, password: string) {}
    async signOut(loginId: string) {}
}
