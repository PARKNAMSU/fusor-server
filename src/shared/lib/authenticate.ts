import { createHash, createHmac } from "crypto";

export function generateHash<T>(data: T, secret: string): string {
  return createHmac("sha256", secret)
    .update(JSON.stringify(data))
    .digest("hex");
}

export function generateAPIHash(
  valid: {
    apiKey: string;
    hostname: string;
    timestamp: number;
    path: string;
  },
  secret: string,
): string {
  const interval = 3 * 1000;
  const newTimestamp = Math.floor(valid.timestamp / interval) * interval;
  return generateHash(
    {
      ...valid,
      timestamp: newTimestamp,
    },
    secret,
  );
}
