import { AccountType } from '../configs/option.configs';
import { Platform } from './platform.types';

export interface Account {
    id: string;
    loginId: string;
    password: string;
    type: AccountType;
    createdAt: string;
}

export interface TokenData extends Omit<Account, 'password'> {
    platforms: Platform[];
}
