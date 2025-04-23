import { AdminRole } from '../configs/option.configs';

export interface AdminAccountEntity {
    loginId: string;
    password: string;
    role: AdminRole;
    createdAt: string;
    updatedAt?: string;
}
