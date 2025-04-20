export function getSecretEncryptKey(): string {
  if (process.env.ENVIRONMENT === "development") {
    return process.env.SECRET_ENCRYPT_KEY || "unknown";
  }
  // todo: parameter store 에서 가져오게 처리
  return "";
}

export const SECRET_ENCRYPT_SEP = ":";
