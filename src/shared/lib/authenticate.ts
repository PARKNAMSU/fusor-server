import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "crypto";
import { SECRET_ENCRYPT_SEP } from "../configs/secret.configs";

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

export function encrypt(text: string, key: string): string {
  const iv = randomBytes(16); // Initialization Vector
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(key, "hex"), iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf-8"),
    cipher.final(),
  ]);
  return `${iv}${SECRET_ENCRYPT_SEP}${encrypted.toString("hex")}`;
}

export function decrypt(encrypt: string, key: string): string {
  const [iv, encryptedData] = encrypt.split(SECRET_ENCRYPT_SEP);
  const decipher = createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex"),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf-8");
}
