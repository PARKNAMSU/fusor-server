import { AdminRole } from '../shared/configs/option.configs';

export interface AdminSignUpRequestDto {
    loginId: string;
    password: string;
    role: AdminRole;
}
