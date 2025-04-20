import { ManipulateType } from "dayjs";
export const SERVER_TIME_FORMAT_DEFAULT = "YYYY-MM-DD HH:mm:ss";

export const defaultApiKeyPeriod: {
  key: ManipulateType;
  value: number;
} = {
  key: "days",
  value: 90,
};
