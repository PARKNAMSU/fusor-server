import { marshall } from '@aws-sdk/util-dynamodb';
import { tables, FusorDynamoDB, updateInputParsor } from '../lib/dynamodb';
import { FusorRepository } from './fusorRepository';
import { PlatformEntity } from '../entity/platformEntity';
import { Platform, UpdatePlatform } from '../@types/platform.types';
import dayjs from 'dayjs';
import { SERVER_TIME_FORMAT_DEFAULT } from '../configs/common.configs';

export class PlatformRepository extends FusorRepository {
    constructor(dynamo: FusorDynamoDB) {
        super(dynamo, tables.platform);
    }
    async get({
        hostname,
        apiKey,
        accountId,
    }: {
        hostname?: string;
        apiKey?: string;
        accountId?: string;
    }): Promise<PlatformEntity | null> {
        const key: { [key: string]: string } = {};
        try {
            if (!!hostname) {
                key['hostname'] = hostname;
            }
            if (!!apiKey) {
                key['apiKey'] = apiKey;
            }
            if (!!accountId) {
                key['accountId'] = accountId;
            }
            if (!Object.keys(key).length) {
                throw new Error('not exist search key');
            }

            return await this.db.getItem<PlatformEntity>({
                TableName: this.table,
                Key: marshall(key),
            });
        } catch (e) {
            throw e;
        }
    }
    async create(platform: Platform) {
        try {
            const insertData: PlatformEntity = {
                ...platform,
                createdAt: dayjs().format(SERVER_TIME_FORMAT_DEFAULT),
            };

            await this.db.putItem({
                TableName: this.table,
                Item: marshall(insertData),
            });
        } catch (e) {
            throw e;
        }
    }
    async update({
        accountId,
        roleList,
        userInfoKeys,
        IdentifierKey,
        userAuthPolicy,
        secondaryAuthPolicy,
        userDeletePolicy,
    }: UpdatePlatform) {
        try {
            await this.db.updateItem(
                updateInputParsor({
                    table: this.table,
                    key: {
                        accountId,
                    },
                    update: {
                        roleList,
                        userInfoKeys,
                        IdentifierKey,
                        userAuthPolicy,
                        secondaryAuthPolicy,
                        userDeletePolicy,
                    },
                }),
            );
        } catch (e) {
            throw e;
        }
    }
    async getList(accountId: string): Promise<PlatformEntity[]> {
        try {
            return await this.db.listItems<PlatformEntity>({
                TableName: this.table,
                IndexName: 'accountId_idx',
                KeyConditionExpression: 'accountId = :accountId',
                ExpressionAttributeValues: marshall({ [':accountId']: accountId }),
            });
        } catch (e) {
            throw e;
        }
    }
}
