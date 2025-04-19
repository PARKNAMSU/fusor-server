export enum UserAuthPolicy {
  ID_PASSWORD = 1,
  OAUTH2 = 2,
  TOTP = 3,
  EMAIL_SEND = 4,
}

export enum SecondaryAuthPolicy {
  NONE = 0,
  OPTIONAL = 1,
  REQUIRED = 2,
}

export enum UserDeletePolicy {
  DELETE = 0,
  STATUS_UPDATE = 1,
  MOVE_DELETE_TABLE = 2,
}

export enum Status {
  UNAVALIABLE = 0,
  AVALIABLE = 1,
  IDLE = 2,
}
