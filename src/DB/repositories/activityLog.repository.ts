import { Model } from "mongoose";
import { DatabaseRepository } from "./databas.repositories";
import { IActivityLog } from "../model/activityLog.model";

export class ActivityLogRepository extends DatabaseRepository<IActivityLog> {
  constructor(protected override readonly model: Model<IActivityLog>) {
    super(model);
  }
}
