import mongoose, { models, Types, HydratedDocument } from "mongoose";

export enum RoleEnum {
  User = "User",
  Guardian = " Guardian",
  Child = "Child",
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
  },
  { timestamps: true }
);

export const UserModel =
  models.User || mongoose.model<IUser>("User", userSchema);
export type HUserDocument = HydratedDocument<IUser>;
