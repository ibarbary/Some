import mongoose, { models, Types, HydratedDocument } from "mongoose";

export type LevelStatus = "in_progress" | "completed";

export interface ILearnerLevelProgress {
  _id: Types.ObjectId;
  learner_id: Types.ObjectId;
  stage_id: Types.ObjectId;
  level_index: number; // 1, 2, or 3 — matches frontend constant
  status: LevelStatus;
  attempts: number; 
  accuracy: number; // accuracy from most recent completed attempt (0.0–1.0)
  best_accuracy: number;
  completed_at?: Date; // first time it was completed (never overwritten)
  updated_at: Date; // last time any attempt was recorded
}

const learnerLevelProgressSchema = new mongoose.Schema<ILearnerLevelProgress>(
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
    level_index: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    attempts: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0, min: 0, max: 1 },
    best_accuracy: { type: Number, default: 0, min: 0, max: 1 },
    completed_at: { type: Date },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

// One level progress record per learner per stage per level
learnerLevelProgressSchema.index(
  { learner_id: 1, stage_id: 1, level_index: 1 },
  { unique: true },
);

// Fast lookup: all levels for a learner in a stage
learnerLevelProgressSchema.index({ learner_id: 1, stage_id: 1 });

export const LearnerLevelProgressModel =
  models.LearnerLevelProgress ||
  mongoose.model<ILearnerLevelProgress>(
    "LearnerLevelProgress",
    learnerLevelProgressSchema,
  );

export type HLearnerLevelProgressDocument =
  HydratedDocument<ILearnerLevelProgress>;
