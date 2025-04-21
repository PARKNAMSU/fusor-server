import {
    DynamoDBClient,
    GetItemCommandInput,
    GetItemCommand,
    PutItemCommandInput,
    PutItemCommand,
    CreateTableCommand,
    CreateTableCommandInput,
    BillingMode,
    DescribeTableCommand,
    QueryCommandInput,
    QueryCommand,
    AttributeValue,
    UpdateItemCommandInput,
    UpdateItemCommand,
    DeleteItemCommandInput,
    DeleteItemCommand,
    TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

let dynamodbOptions: { [key: string]: any } = {};

if (process.env.ENVIRONMENT === 'development') {
    dynamodbOptions = {
        credentials: {
            accessKeyId: 'dummy', // 로컬 테스트용 임의 키
            secretAccessKey: 'dummy', // 로컬 테스트용 임의 시크릿
        },
        endpoint: 'http://host.docker.internal:8000',
        region: 'ap-northeast-2',
    };
}

type TableName = string;

type FusorTransactionTaskType = 'put' | 'update' | 'delete';

interface FusorDynamoDBTransactionInput {
    input: {
        TableName: string | undefined;
        Item?: Record<string, AttributeValue> | undefined;
        Key?: Record<string, AttributeValue> | undefined;
        UpdateExpression?: string;
    };
    taskType: FusorTransactionTaskType;
}

export const tables: { [key: string]: TableName } = {
    platform: 'platform',
    apiKeyRegistry: 'apiKeyRegistry',
    user: 'user',
    blackList: 'blackList',
    session: 'session',
    platformRequest: 'platformRequest',
    account: 'account',
    requestLog: 'requestLog',
};

export class FusorDynamoDB {
    private client: DynamoDBClient; // dynamodb 클라이언트
    private isTransaction: boolean;
    private transactionTasks: FusorDynamoDBTransactionInput[];
    constructor(isTransaction: boolean) {
        this.client = new DynamoDBClient(dynamodbOptions);
        this.isTransaction = isTransaction;
        this.transactionTasks = [];
    }

    async writeTransaction() {
        const tempTasks = [...this.transactionTasks];
        // 트랜잭션 작업 비우기
        this.transactionTasks = [];
        try {
            await this.client.send(
                new TransactWriteItemsCommand({
                    TransactItems: tempTasks.map((task: FusorDynamoDBTransactionInput) => {
                        const { TableName, Item, Key, UpdateExpression } = task.input;
                        switch (task.taskType) {
                            case 'put':
                                return {
                                    Put: {
                                        TableName,
                                        Item,
                                    },
                                };
                            case 'delete':
                                return {
                                    Delete: {
                                        TableName,
                                        Key,
                                    },
                                };
                            default:
                                return {
                                    Update: {
                                        TableName,
                                        Key,
                                        UpdateExpression,
                                    },
                                };
                        }
                    }),
                }),
            );
        } catch (e) {
            throw e;
        }
    }

    async getItem<T>(input: GetItemCommandInput): Promise<T | null> {
        try {
            const res = await this.client.send(new GetItemCommand(input));
            if (!res?.Item) {
                return null;
            }
            return unmarshall(res.Item) as T;
        } catch (e) {
            throw e;
        }
    }

    async putItem(input: PutItemCommandInput, sync: boolean = true) {
        try {
            if (this.isTransaction && sync) {
                this.transactionTasks.push({
                    taskType: 'put',
                    input: {
                        TableName: input.TableName,
                        Item: input.Item,
                    },
                });
                return;
            }
            if (sync) {
                const res = await this.client.send(new PutItemCommand(input));
            } else {
                this.client
                    .send(new PutItemCommand(input))
                    .then(() => {})
                    .catch((e) => console.trace(e));
            }
        } catch (e) {
            throw e;
        }
    }

    async listItems<T>(input: QueryCommandInput): Promise<T[]> {
        try {
            const res = await this.client.send(new QueryCommand(input));
            if (!res.Items) {
                return [];
            }
            return res.Items.map((val: Record<string, AttributeValue>) => {
                return unmarshall(val) as T;
            });
        } catch (e) {
            throw e;
        }
    }

    async updateItem(input: UpdateItemCommandInput, sync: boolean = true) {
        try {
            if (this.isTransaction && sync) {
                this.transactionTasks.push({
                    taskType: 'update',
                    input: {
                        TableName: input.TableName,
                        Key: input.Key,
                        UpdateExpression: input.UpdateExpression,
                    },
                });
                return;
            }
            if (sync) {
                await this.client.send(new UpdateItemCommand(input));
            } else {
                this.client
                    .send(new UpdateItemCommand(input))
                    .then(() => {})
                    .catch((e) => console.trace(e));
            }
        } catch (e) {
            throw e;
        }
    }

    async deleteItem(input: DeleteItemCommandInput, sync: boolean = true) {
        try {
            if (this.isTransaction && sync) {
                this.transactionTasks.push({
                    taskType: 'update',
                    input: {
                        TableName: input.TableName,
                        Key: input.Key,
                    },
                });
                return;
            }
            if (sync) {
                await this.client.send(new DeleteItemCommand(input));
            } else {
                this.client
                    .send(new DeleteItemCommand(input))
                    .then(() => {})
                    .catch((e) => console.trace(e));
            }
        } catch (e) {
            throw e;
        }
    }

    async initTable() {
        if (process.env.ENVIRONMENT !== 'development') {
            return;
        }

        const account: CreateTableCommandInput = {
            TableName: tables.account,
            BillingMode: BillingMode.PAY_PER_REQUEST,
            AttributeDefinitions: [
                {
                    AttributeName: 'id',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'id', // required
                    KeyType: 'HASH', // required
                },
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'loginId_idx',
                    KeySchema: [
                        {
                            AttributeName: 'loginId',
                            KeyType: 'HASH',
                        },
                    ],
                    Projection: {
                        ProjectionType: 'ALL', // Include all attributes in the index
                    },
                },
            ],
        };

        const platform: CreateTableCommandInput = {
            TableName: tables.platform,
            BillingMode: BillingMode.PAY_PER_REQUEST,
            AttributeDefinitions: [
                // AttributeDefinitions // required
                {
                    AttributeName: 'apiKey', // required
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'hostname',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                // KeySchema // required
                {
                    // KeySchemaElement
                    AttributeName: 'hostname', // required
                    KeyType: 'HASH', // required
                },
            ],
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'apiKey_idx',
                    KeySchema: [
                        {
                            AttributeName: 'apiKey',
                            KeyType: 'HASH',
                        },
                    ],
                    Projection: {
                        ProjectionType: 'ALL', // Include all attributes in the index
                    },
                },
                {
                    IndexName: 'accountId_idx',
                    KeySchema: [
                        {
                            AttributeName: 'accountId',
                            KeyType: 'HASH',
                        },
                    ],
                    Projection: {
                        ProjectionType: 'ALL', // Include all attributes in the index
                    },
                },
            ],
        };
        const platformRequest: CreateTableCommandInput = {
            TableName: tables.platformRequest,
            BillingMode: BillingMode.PAY_PER_REQUEST,
            AttributeDefinitions: [
                // AttributeDefinitions // required
                {
                    AttributeName: 'hostname',
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'requestedAt',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'hostname',
                    KeyType: 'HASH',
                },
                {
                    AttributeName: 'requestedAt',
                    KeyType: 'RANGE',
                },
            ],
        };
        const apiKeyRegistry: CreateTableCommandInput = {
            TableName: tables.apiKeyRegistry,
            BillingMode: BillingMode.PAY_PER_REQUEST,
            AttributeDefinitions: [
                {
                    AttributeName: 'apiKey',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                // KeySchema // required
                {
                    // KeySchemaElement
                    AttributeName: 'apiKey', // required
                    KeyType: 'HASH', // required
                },
            ],
        };
        const user: CreateTableCommandInput = {
            TableName: tables.user,
            BillingMode: BillingMode.PAY_PER_REQUEST,
            AttributeDefinitions: [
                {
                    AttributeName: 'identifier',
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'hostname',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'identifier',
                    KeyType: 'HASH',
                },
                {
                    AttributeName: 'hostname',
                    KeyType: 'RANGE',
                },
            ],
        };
        const blackList: CreateTableCommandInput = {
            TableName: tables.blackList,
            BillingMode: BillingMode.PAY_PER_REQUEST,
            AttributeDefinitions: [
                {
                    AttributeName: 'key',
                    AttributeType: 'S',
                },
                {
                    AttributeName: 'keyType',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'key',
                    KeyType: 'HASH',
                },
                {
                    AttributeName: 'keyType',
                    KeyType: 'RANGE',
                },
            ],
        };

        for (const input of [account, platform, platformRequest, apiKeyRegistry, user, blackList]) {
            let isExist = true;
            try {
                await this.client.send(
                    new DescribeTableCommand({
                        TableName: input.TableName,
                    }),
                );
            } catch {
                isExist = false;
            }

            if (isExist) {
                continue;
            }

            try {
                await this.client.send(new CreateTableCommand(input));
            } catch (e) {
                throw e;
            }
        }
    }
}
