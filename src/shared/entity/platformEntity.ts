import {
  SecondaryAuthPolicy,
  Status,
  UserAuthPolicy,
  UserDeletePolicy,
} from "../configs/option.configs";

export interface PlatformEntity {
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
  createdAt: string;
  updatedAt?: string;
}

export interface PlatformRequestEntity
  extends Omit<PlatformEntity, "apiKey" | "createdAt" | "updatedAt"> {
  requiredAt: string;
}

export interface ApiKeyRegistryEntity {
  apiKey: string;
  status: Status;
  expiredAt: string;
}
