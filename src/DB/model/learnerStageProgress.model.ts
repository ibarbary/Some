import mongoose, { models, Types, HydratedDocument } from "mongoose";

export type StageStatus = "in_progress" | "completed";

export interface ILearnerStageProgress {
  _id: Types.ObjectId;
  learner_id: Types.ObjectId;
  stage_id: Types.ObjectId;
  status: StageStatus;
  completed_levels: number; // 0 → stage.total_levels
  progress: number; // completed_levels / total_levels  (0.0 – 1.0)
  started_at: Date;
  updated_at: Date;
}

const learnerStageProgressSchema = new mongoose.Schema<ILearnerStageProgress>(
  {
    learner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
      required: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    completed_levels: { type: Number, default: 0 },
    progress: { type: Number, default: 0, min: 0, max: 1 },
    started_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: false }, // we manage updated_at manually
);

// One progress record per learner per stage — no duplicates
learnerStageProgressSchema.index(
  { learner_id: 1, stage_id: 1 },
  { unique: true },
);

// Fast lookups: all stages for a learner
learnerStageProgressSchema.index({ learner_id: 1 });

export const LearnerStageProgressModel =
  models.LearnerStageProgress ||
  mongoose.model<ILearnerStageProgress>(
    "LearnerStageProgress",
    learnerStageProgressSchema,
  );

export type HLearnerStageProgressDocument =
  HydratedDocument<ILearnerStageProgress>;
