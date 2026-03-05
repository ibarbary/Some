import { Model } from "mongoose";
import { DatabaseRepository } from "./databas.repositories";
import { IStage } from "../model/stage.model";

export class StageRepository extends DatabaseRepository<IStage> {
  constructor(protected override readonly model: Model<IStage>) {
    super(model);
  }
}
