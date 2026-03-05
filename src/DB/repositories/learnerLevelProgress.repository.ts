import { Model } from "mongoose";
import { DatabaseRepository } from "./databas.repositories";
import { ILearnerLevelProgress } from "../model/learnerLevelProgress.model";

export class LearnerLevelProgressRepository extends DatabaseRepository<ILearnerLevelProgress> {
  constructor(protected override readonly model: Model<ILearnerLevelProgress>) {
    super(model);
  }
}
