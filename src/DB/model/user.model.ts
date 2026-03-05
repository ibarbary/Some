import mongoose, { models, Types, HydratedDocument } from "mongoose";

export enum RoleEnum {
  User = "User",
  Guardian = "Guardian",
  Child = "Child",
}

export interface IOverallProgress {
  en: number; // 0.0 – 1.0
  ar: number; // 0.0 – 1.0
}

export interface IAverageAccuracy {
  en: number; // 0.0 – 1.0
  ar: number; // 0.0 – 1.0
}

interface IAchievement {
  key: string; // unique identifier e.g. 'SEVEN_DAY_STREAK'
  name: string; // display text e.g. '7 Day Streak'
  earned_at: Date;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmEmailOtp?: string;
  forgetPasswordOtp?: string;
  forgetPasswordOtpExpires?: Date;
  changeCredentialsTime?: Date;
  birthdate?: Date;
  role: RoleEnum;
  parentId?: Types.ObjectId;
  provider?: "google" | "facebook" | "local";
  providerId?: string;
  profileImage?: string;

  tags: string[];
  overall_progress: IOverallProgress;
  average_accuracy: IAverageAccuracy;
  achievements: IAchievement[];
  total_study_seconds: number;
  last_study_date?: Date; // date of last completed session
  current_streak_days: number;
  longest_streak_days: number;
}

export const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, min: 8 },
    confirmEmailOtp: { type: String, min: 6 },
    changeCredentialsTime: Date,
    forgetPasswordOtp: { type: String, min: 6 },
    forgetPasswordOtpExpires: { type: Date },
    birthdate: { type: Date },
    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    provider: {
      type: String,
      enum: ["google", "facebook", "local"],
      default: "local",
    },
    providerId: { type: String },
    profileImage: { type: String },

    tags: { type: [String], default: [] },
    overall_progress: {
      en: { type: Number, default: 0, min: 0, max: 1 },
      ar: { type: Number, default: 0, min: 0, max: 1 },
    },
    average_accuracy: {
      en: { type: Number, default: 0, min: 0, max: 1 },
      ar: { type: Number, default: 0, min: 0, max: 1 },
    },
    achievements: [
      {
        key: { type: String, required: true },
        name: { type: String, required: true },
        earned_at: { type: Date, default: Date.now },
      },
    ],
    total_study_seconds: { type: Number, default: 0 },
    last_study_date: { type: Date },
    current_streak_days: { type: Number, default: 0 },
    longest_streak_days: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const UserModel =
  models.User || mongoose.model<IUser>("User", userSchema);
export type HUserDocument = HydratedDocument<IUser>;
