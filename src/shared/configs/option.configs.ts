// 플랫폼 유저 인증 정책
export enum UserAuthPolicy {
  ID_PASSWORD = 1,
  OAUTH2 = 2,
  TOTP = 3,
  EMAIL_SEND = 4,
}

// 플랫폼 유저 2차 인증 정책
export enum SecondaryAuthPolicy {
  NONE = 0,
  OPTIONAL = 1,
  REQUIRED = 2,
}

// 플랫폼 유저 삭제 정책
export enum UserDeletePolicy {
  DELETE = 0,
  STATUS_UPDATE = 1,
  MOVE_DELETE_TABLE = 2,
}

// 공용 상태
export enum Status {
  UNAVALIABLE = 0,
  AVALIABLE = 1,
  IDLE = 2,
}

// 플랫폼 관리자 유저 타입
export enum AccountType {
  NORMAL = 1,
  OAUTH2 = 2,
}
