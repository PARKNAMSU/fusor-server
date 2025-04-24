import { ManipulateType } from 'dayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const fusorDayjs = dayjs;

export const SERVER_TIME_FORMAT_DEFAULT = 'YYYY-MM-DD HH:mm:ss.sss';
export const USER_SESSION_EXPIRED_PERIOD = 60 * 60 * 24 * 30;
export const ADMIN_SESSION_EXPIRED_PERIOD = 60 * 60 * 24 * 30;

export const defaultApiKeyPeriod: {
    key: ManipulateType;
    value: number;
} = {
    key: 'days',
    value: 90,
};
