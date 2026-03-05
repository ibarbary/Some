import mongoose, { models, Types, HydratedDocument } from "mongoose";

export type LanguageEnum = "en" | "ar";

export interface IStage {
  _id: Types.ObjectId;
  name: string;
  language: LanguageEnum;
  order_index: number; // 1, 2, 3, 4 — per language
  total_levels: number;
}

const stageSchema = new mongoose.Schema<IStage>(
  {
    name: { type: String, required: true },
    language: {
      type: String,
      enum: ["en", "ar"],
      required: true,
    },
    order_index: { type: Number, required: true },
    total_levels: { type: Number, required: true, default: 3 },
  },
  { timestamps: false },
);

// Ensure no duplicate stage per language + order
stageSchema.index({ language: 1, order_index: 1 }, { unique: true });

export const StageModel =
  models.Stage || mongoose.model<IStage>("Stage", stageSchema);
export type HStageDocument = HydratedDocument<IStage>;