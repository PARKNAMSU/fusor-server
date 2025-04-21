import { AccountType } from "../configs/option.configs";

export interface AccountEntity {
  id: string; // uuid
  loginId: string;
  password: string;
  type: AccountType;
  createdAt: string;
}
