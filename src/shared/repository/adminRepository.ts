import { marshall } from '@aws-sdk/util-dynamodb';
import { AdminAccountEntity } from '../entity/admin';
import { FusorDynamoDB, tables } from '../lib/dynamodb';
import { FusorRepository } from './fusorRepository';
import { AdminAccount } from '../@types/admin.types';

export class AdminRepository extends FusorRepository {
    constructor(db: FusorDynamoDB) {
        super(db, tables.adminAccount);
    }
    async get(loginId: string): Promise<AdminAccountEntity | null> {
        try {
            return await this.db.getItem<AdminAccountEntity>({
                TableName: this.table,
                Key: marshall({ loginId }),
            });
        } catch (e) {
            throw e;
        }
    }
    async create(data: AdminAccount) {
        try {
            await this.db.putItem({
                TableName: this.table,
                Item: marshall({ ...data }),
            });
        } catch (e) {
            throw e;
        }
    }
    async delete(loginId: string) {
        try {
            await this.db.deleteItem({
                TableName: this.table,
                Key: marshall({ loginId }),
            });
        } catch (e) {
            throw e;
        }
    }
}
