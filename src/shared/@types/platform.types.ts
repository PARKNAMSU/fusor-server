import {
  SecondaryAuthPolicy,
  Status,
  UserAuthPolicy,
  UserDeletePolicy,
} from "../configs/option.configs";

export interface Platform {
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
