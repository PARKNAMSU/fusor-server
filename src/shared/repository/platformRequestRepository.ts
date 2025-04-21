import dayjs from 'dayjs';
import { Platform } from '../@types/platform.types';
import { SERVER_TIME_FORMAT_DEFAULT } from '../configs/common.configs';
import { PlatformRequestEntity } from '../entity/platformEntity';
import { FusorRepository } from './fusorRepository';
import { tables, FusorDynamoDB } from '../lib/dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

export class PlatformRequestRepository extends FusorRepository {
    constructor(dynamo: FusorDynamoDB) {
        super(dynamo, tables.platformRequest);
    }
    async create(platform: Omit<Platform, 'apiKey'>) {
        try {
            const insertData: PlatformRequestEntity = {
                ...platform,
                requiredAt: dayjs().format(SERVER_TIME_FORMAT_DEFAULT),
            };

            await this.db.putItem({
                TableName: tables.platformRequest,
                Item: marshall(insertData),
            });
        } catch (e) {
            throw e;
        }
    }
    async delete(hostname: string) {}
}
