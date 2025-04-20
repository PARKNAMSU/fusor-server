import { randomBytes } from "crypto";
import { generateRandomString } from "../lib/common";
import { FusorRepository } from "./fusorRepository";
import { decrypt, encrypt } from "../lib/authenticate";
import { getSecretEncryptKey } from "../configs/secret.configs";
import { marshall } from "@aws-sdk/util-dynamodb";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import dynamodb, { tables } from "../lib/dynamodb";
import { defaultApiKeyPeriod } from "../configs/common.configs";
import { Status } from "../configs/option.configs";
import { ApiKeyRegistryEntity } from "../entity/platformEntity";

dayjs.extend(utc);

export class ApiKeyRepository extends FusorRepository {
  // apiKey 생성
  async register(): Promise<string> {
    try {
      const apiKey = generateRandomString(16);
      const secretKey = randomBytes(256).toString();
      const encryptSecretKey = encrypt(secretKey, getSecretEncryptKey());

      await this.db.putItem({
        TableName: tables.apiKeyRegistry,
        Item: marshall({
          apiKey,
          secretKey,
          encryptSecretKey,
          expiredAt: dayjs().add(
            defaultApiKeyPeriod.value,
            defaultApiKeyPeriod.key,
          ),
          status: Status.AVALIABLE,
        }),
      });
      // secret key 는 클라이언트에 반환하지 않으므로 apiKey 만 리턴
      return apiKey;
    } catch (e) {
      throw e;
    }
  }
  // apiKey 가져오기
  async get(
    apiKey: string,
    available: boolean = false,
  ): Promise<{
    apiKey: string;
    secretKey: string;
  } | null> {
    try {
      const data = await this.db.getItem<ApiKeyRegistryEntity>({
        TableName: tables.apiKeyRegistry,
        Key: marshall({
          apiKey,
        }),
      });

      if (!data) {
        return null;
      }

      const $return = {
        apiKey: data.apiKey,
        secretKey: decrypt(data.secretKey, getSecretEncryptKey()),
      };

      if (!available) {
        return $return;
      }
      return dayjs(data.expiredAt).utc() < dayjs().utc() ||
        data.status !== Status.AVALIABLE
        ? null
        : $return;
    } catch (e) {
      throw e;
    }
  }
}

export default new ApiKeyRepository(dynamodb);
