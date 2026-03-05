import { Model } from "mongoose";
import { DatabaseRepository } from "./databas.repositories";
import { ILearnerSession } from "../model/learnerSession.model";

export class LearnerSessionRepository extends DatabaseRepository<ILearnerSession> {
  constructor(protected override readonly model: Model<ILearnerSession>) {
    super(model);
  }
}
