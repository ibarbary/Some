import { Model } from "mongoose";
import { DatabaseRepository } from "./databas.repositories";
import { ILearnerStageProgress } from "../model/learnerStageProgress.model";

export class LearnerStageProgressRepository extends DatabaseRepository<ILearnerStageProgress> {
  constructor(protected override readonly model: Model<ILearnerStageProgress>) {
    super(model);
  }
}
