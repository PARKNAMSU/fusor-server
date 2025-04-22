import { Redis } from '@upstash/redis';

export class FusorRedis {
    private readonly client: Redis;
    constructor() {
        this.client = new Redis({
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
                await this.client.set(k, JSON.stringify(v), options);
            } else {
                this.client
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
        console.log({
            k,
            sync,
        });
        try {
            if (sync) {
                await this.client.del(k);
            } else {
                this.client
                    .del(k)
                    .then(() => {})
                    .catch((e) => {
                        console.trace(e);
                    });
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    async get<T>(k: string): Promise<T | null> {
        try {
            const data = await this.client.get(k);
            if (!data) {
                return null;
            }
            return data as T;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    async getClient(): Promise<Redis> {
        return this.client;
    }
}

export default new FusorRedis();
