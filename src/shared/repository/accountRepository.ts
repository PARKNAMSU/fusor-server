import { marshall } from '@aws-sdk/util-dynamodb';
import { FusorDynamoDB, tables } from '../lib/dynamodb';
import { FusorRepository } from './fusorRepository';
import { v4 as uuid } from 'uuid';
import { generateHash } from '../lib/authenticate';
import { getSecretPasswordKey } from '../configs/secret.configs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SERVER_TIME_FORMAT_DEFAULT } from '../configs/common.configs';
import { AccountEntity } from '../entity/account';
import { Account } from '../@types/account.types';
import { AccountType } from '../configs/option.configs';

dayjs.extend(utc);

export class AccountRepository extends FusorRepository {
    constructor(dynamodb: FusorDynamoDB) {
        super(dynamodb, tables.account);
    }
    async get(id: string): Promise<Account | null> {
        try {
            return await this.db.getItem<AccountEntity>({
                TableName: this.table,
                Key: marshall({
                    id,
                }),
            });
        } catch (e) {
            throw e;
        }
    }
    async getByLoginId(loginId: string): Promise<Account | null> {
        try {
            const list = await this.db.listItems<AccountEntity>({
                TableName: this.table,
                IndexName: 'loginId_idx',
                KeyConditionExpression: 'loginId = :loginId',
                ExpressionAttributeValues: marshall({ [':loginId']: loginId }),
            });
            return list?.[0] || null;
        } catch (e) {
            throw e;
        }
    }

    async create({
        loginId,
        password,
        type = AccountType.NORMAL,
    }: {
        loginId: string;
        password: string;
        type?: AccountType;
    }): Promise<AccountEntity> {
        try {
            const account: AccountEntity = {
                id: uuid(),
                loginId,
                type,
                password: generateHash(password, getSecretPasswordKey()),
                createdAt: dayjs().utc().format(SERVER_TIME_FORMAT_DEFAULT),
            };

            await this.db.putItem({
                TableName: this.table,
                Item: marshall(account),
            });
            return account;
        } catch (e) {
            throw e;
        }
    }
    async delete({ id }: { id: string }) {
        try {
            await this.db.deleteItem({
                TableName: this.table,
                Key: marshall({ id }),
            });
        } catch (e) {
            throw e;
        }
    }
}
