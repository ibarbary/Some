import mongoose, { models, Types, HydratedDocument } from "mongoose";

export type SessionStatus = "active" | "completed" | "abandoned";

export interface ILearnerSession {
  _id: Types.ObjectId;
  learner_id: Types.ObjectId;
  stage_id: Types.ObjectId;
  level_index: number; // which level (1, 2, 3) — sent by Flutter at session start

  started_at: Date;
  ended_at?: Date;

  // Cumulative active play time — built up via heartbeats
  // NOT simply ended_at - started_at (gaps when app is backgrounded are excluded)
  duration_seconds: number;

  status: SessionStatus;

  // Updated every heartbeat — used to detect gaps and avoid counting away-time
  last_active_at: Date;
}

const learnerSessionSchema = new mongoose.Schema<ILearnerSession>(
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
    started_at: { type: Date, default: Date.now },
    ended_at: { type: Date },
    duration_seconds: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
    last_active_at: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

// Fast lookups
learnerSessionSchema.index({ learner_id: 1, status: 1 });
learnerSessionSchema.index({ learner_id: 1, stage_id: 1 });

export const LearnerSessionModel =
  models.LearnerSession ||
  mongoose.model<ILearnerSession>("LearnerSession", learnerSessionSchema);

export type HLearnerSessionDocument = HydratedDocument<ILearnerSession>;
