import mongoose, { models, Types, HydratedDocument } from "mongoose";

export enum ActivityType {
  LevelCompleted = "level_completed",
  StageCompleted = "stage_completed",
  AchievementEarned = "achievement_earned",
  StageStarted = "stage_started",
}

export interface IActivityMetadata {
  stage_name?: string;
  level_index?: number;
  accuracy?: number;
  achievement_key?: string;
}

export interface IActivityLog {
  _id: Types.ObjectId;
  learner_id: Types.ObjectId;
  parent_id: Types.ObjectId;

  type: ActivityType;

  description: string;

  metadata?: IActivityMetadata;

  created_at: Date;
}

export const activityLogSchema = new mongoose.Schema<IActivityLog>(
  {
    learner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    metadata: {
      stage_name: { type: String },
      level_index: { type: Number },
      accuracy: { type: Number },
      achievement_key: { type: String },
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false },
);

activityLogSchema.index({ parent_id: 1, created_at: -1 });
activityLogSchema.index({ learner_id: 1, created_at: -1 });

export const ActivityLogModel =
  models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);

export type HActivityLogDocument = HydratedDocument<IActivityLog>;
