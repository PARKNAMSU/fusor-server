import { AdminRole } from '../configs/option.configs';

export interface AdminAccount {
    loginId: string;
    password: string;
    role: AdminRole;
    createdAt: string;
    updatedAt?: string;
}
