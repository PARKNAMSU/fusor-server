import { FusorDynamoDB } from '../shared/lib/dynamodb';
import { AccountRepository } from '../shared/repository/\baccountRepository';
import { PlatformRepository } from '../shared/repository/platformRepository';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

const db = new FusorDynamoDB(true);

const accountRepository = new AccountRepository(db);
const platformRepository = new PlatformRepository(db);

const service = new AccountService(accountRepository, platformRepository);

export default new AccountController(service);
