import { FusorDynamoDB } from "../lib/dynamodb";

export class FusorRepository {
  db: FusorDynamoDB;
  constructor(dynamo: FusorDynamoDB) {
    this.db = dynamo;
  }
}
