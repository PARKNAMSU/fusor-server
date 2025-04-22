import { SecondaryAuthPolicy, UserAuthPolicy, UserDeletePolicy } from '../configs/option.configs';

export interface Platform {
    accountId: string;
    hostname: string;
    apiKey: string;
    roleList: string[];
    userInfoKeys: {
        key: string;
        type: string;
        required: boolean;
    }[];
    IdentifierKey: string;
    userAuthPolicy: UserAuthPolicy;
    secondaryAuthPolicy: SecondaryAuthPolicy;
    userDeletePolicy: UserDeletePolicy;
}

export interface UpdatePlatform extends Omit<Platform, 'hostname' | 'apiKey'> {}
