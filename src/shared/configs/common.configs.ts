import { ManipulateType } from 'dayjs';

export const SERVER_TIME_FORMAT_DEFAULT = 'YYYY-MM-DD HH:mm:ss.sss';
export const USER_SESSION_EXPIRED_PERIOD = 60 * 60 * 24 * 30;

export const defaultApiKeyPeriod: {
    key: ManipulateType;
    value: number;
} = {
    key: 'days',
    value: 90,
};
