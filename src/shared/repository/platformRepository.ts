import { marshall } from "@aws-sdk/util-dynamodb";
import dynamodb, { tables } from "../lib/dynamodb";
import { FusorRepository } from "./fusorRepository";
import { PlatformEntity } from "../entity/platformEntity";
import { Platform } from "../@types/platform.types";
import dayjs from "dayjs";
import { SERVER_TIME_FORMAT_DEFAULT } from "../configs/common.configs";

export class platformRepository extends FusorRepository {
  async get({
    hostname,
    apiKey,
  }: {
    hostname?: string;
    apiKey?: string;
  }): Promise<PlatformEntity | null> {
    const key: { [key: string]: string } = {};
    try {
      if (!!hostname) {
        key["hostname"] = hostname;
      }
      if (!!apiKey) {
        key["apiKey"] = apiKey;
      }
      if (!Object.keys(key).length) {
        throw new Error("not exist search key");
      }

      return await this.db.getItem<PlatformEntity>({
        TableName: tables.platform,
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
        TableName: tables.platformRequest,
        Item: marshall(insertData),
      });
    } catch (e) {
      throw e;
    }
  }
}

export default new platformRepository(dynamodb);
