import { FusorDynamoDB } from '../shared/lib/dynamodb';
import { AdminRepository } from '../shared/repository/adminRepository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

const db = new FusorDynamoDB(true);
const adminRepository = new AdminRepository(db);
const service = new AdminService(adminRepository);

export default new AdminController(service);
