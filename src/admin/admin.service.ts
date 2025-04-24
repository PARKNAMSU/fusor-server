import { AdminRepository } from '../shared/repository/adminRepository';
import { AdminSignUpRequestDto } from './admin.dto';

export class AdminService {
    adminRepository: AdminRepository;
    constructor(adminRepository: AdminRepository) {
        this.adminRepository = adminRepository;
    }
    async signUp(dto: AdminSignUpRequestDto) {}
    async signIn(loginId: string, password: string) {}
    async signOut(loginId: string) {}
}
