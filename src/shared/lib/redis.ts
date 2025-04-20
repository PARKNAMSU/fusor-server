import { Redis } from "@upstash/redis";

export class FusorRedis {
  redis: Redis;
  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  async set<T>(
    k: string,
    v: T,
    {
      sync = true,
      ttl,
    }: {
      sync: boolean;
      ttl?: number;
    },
  ) {
    let options: { ex: number } | undefined;

    if (ttl) {
      options = {
        ex: ttl,
      };
    }

    try {
      if (sync) {
        await this.redis.set(k, JSON.stringify(v), options);
      } else {
        this.redis
          .set(k, v, options)
          .then(() => {})
          .catch((e) => {
            console.trace(e);
          });
      }
    } catch (e) {
      throw e;
    }
  }
  async delete(k: string, sync = true) {
    try {
      if (sync) {
        await this.redis.del(k);
      } else {
        this.redis
          .del(k)
          .then(() => {})
          .catch((e) => {
            console.trace(e);
          });
      }
    } catch (e) {
      throw e;
    }
  }
  async get<T>(k: string): Promise<T> {
    try {
      const data = await this.redis.get(k);
      return JSON.parse(data as string) as T;
    } catch (e) {
      throw e;
    }
  }
}

export default new FusorRedis();
