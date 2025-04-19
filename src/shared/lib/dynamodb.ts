import {
  ListTablesCommand,
  DynamoDBClient,
  GetItemCommandInput,
  GetItemCommandOutput,
  GetItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
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
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

let dynamodbOptions: { [key: string]: any } = {};

if (process.env.ENVIRONMENT === "development") {
  dynamodbOptions = {
    credentials: {
      accessKeyId: "dummy", // 로컬 테스트용 임의 키
      secretAccessKey: "dummy", // 로컬 테스트용 임의 시크릿
    },
    endpoint: "http://host.docker.internal:8000",
    region: "ap-northeast-2",
  };
}

type TableName = string;

export const tables: { [key: string]: TableName } = {
  platform: "platform",
  apiKeyRegistry: "apiKeyRegistry",
  user: "user",
  blackList: "blackList",
  session: "session",
  platformRequest: "platformRequest",
};

export class FusorDynamoDB {
  private client: DynamoDBClient;
  constructor() {
    this.client = new DynamoDBClient(dynamodbOptions);
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

  async ListItems<T>(input: QueryCommandInput): Promise<T[]> {
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

  async UpdateItem<T>(input: UpdateItemCommandInput) {
    try {
      await this.client.send(new UpdateItemCommand(input));
    } catch (e) {
      throw e;
    }
  }

  async initTable() {
    if (process.env.ENVIRONMENT !== "development") {
      return;
    }
    const platform: CreateTableCommandInput = {
      TableName: tables.platform,
      BillingMode: BillingMode.PAY_PER_REQUEST,
      AttributeDefinitions: [
        // AttributeDefinitions // required
        {
          AttributeName: "apiKey", // required
          AttributeType: "S",
        },
        {
          AttributeName: "hostname",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        // KeySchema // required
        {
          // KeySchemaElement
          AttributeName: "hostname", // required
          KeyType: "HASH", // required
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "apiKey_idx",
          KeySchema: [
            {
              AttributeName: "apiKey",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL", // Include all attributes in the index
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
          AttributeName: "hostname",
          AttributeType: "S",
        },
        {
          AttributeName: "requestedAt",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "hostname",
          KeyType: "HASH",
        },
        {
          AttributeName: "requestedAt",
          KeyType: "RANGE",
        },
      ],
    };
    const apiKeyRegistry: CreateTableCommandInput = {
      TableName: tables.apiKeyRegistry,
      BillingMode: BillingMode.PAY_PER_REQUEST,
      AttributeDefinitions: [
        {
          AttributeName: "apiKey",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        // KeySchema // required
        {
          // KeySchemaElement
          AttributeName: "hostname", // required
          KeyType: "HASH", // required
        },
      ],
    };
    const user: CreateTableCommandInput = {
      TableName: tables.user,
      BillingMode: BillingMode.PAY_PER_REQUEST,
      AttributeDefinitions: [
        {
          AttributeName: "identifier",
          AttributeType: "S",
        },
        {
          AttributeName: "hostname",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "identifier",
          KeyType: "HASH",
        },
        {
          AttributeName: "hostname",
          KeyType: "RANGE",
        },
      ],
    };
    const blackList: CreateTableCommandInput = {
      TableName: tables.blackList,
      BillingMode: BillingMode.PAY_PER_REQUEST,
      AttributeDefinitions: [
        {
          AttributeName: "key",
          AttributeType: "S",
        },
        {
          AttributeName: "keyType",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "key",
          KeyType: "HASH",
        },
        {
          AttributeName: "keyType",
          KeyType: "RANGE",
        },
      ],
    };

    for (const input of [
      platform,
      platformRequest,
      apiKeyRegistry,
      user,
      blackList,
    ]) {
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

export default new FusorDynamoDB();
