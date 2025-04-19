import { marshall } from "@aws-sdk/util-dynamodb";
import dynamodb, { FusorDynamoDB, tables } from "../lib/dynamodb";
import { FusorRepository } from "./fusorRepository";
import {
  PlatformEntity,
  PlatformRequestEntity,
} from "../entity/platformEntity";
import { Platform } from "../@types/platform.types";
import dayjs from "dayjs";
import { SERVER_TIME_FORMAT_DEFAULT } from "../configs/common.configs";

export class platformRepository extends FusorRepository {
  async getByHostname(hostname: string): Promise<PlatformEntity | null> {
    try {
      return await this.db.getItem<PlatformEntity>({
        TableName: tables.platform,
        Key: marshall({
          hostname,
        }),
      });
    } catch (e) {
      throw e;
    }
  }
  async getByApiKey(apiKey: string): Promise<PlatformEntity | null> {
    try {
      return await this.db.getItem<PlatformEntity>({
        TableName: tables.platform,
        Key: marshall({
          apiKey,
        }),
      });
    } catch (e) {
      throw e;
    }
  }
  async CreatePlatformRequest(platform: Omit<Platform, "apiKey">) {
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
  async CreatePlatform(platform: Platform) {
    try {
      const insertData: PlatformEntity = {
        ...platform,
        createdAt: dayjs().format(SERVER_TIME_FORMAT_DEFAULT),
      };

      await this.db.putItem({
        TableName: tables.platformRequest,
        Item: marshall(insertData),
      });
    } catch (e) {
      throw e;
    }
  }
  async RegisterApiKey(): Promise<string> {
    return "";
  }
}

export default new platformRepository(dynamodb);
