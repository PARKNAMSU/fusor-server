import { FusorDynamoDB } from '../shared/lib/dynamodb';
import { AccountRepository } from '../shared/repository/\baccountRepository';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

const accountRepository = new AccountRepository(new FusorDynamoDB(true));
const service = new AccountService(accountRepository);

export default new AccountController(service);
