import { FusorDynamoDB } from '../lib/dynamodb';

export class FusorRepository {
    table: string;
    db: FusorDynamoDB;
    constructor(dynamodb: FusorDynamoDB, table: string) {
        this.table = table;
        this.db = dynamodb;
    }
}
