import mongoose, { Types, HydratedDocument } from "mongoose";
export declare enum RoleEnum {
    User = "User",
    Guardian = "Guardian",
    Child = "Child"
}
export interface IOverallProgress {
    en: number;
    ar: number;
}
export interface IAverageAccuracy {
    en: number;
    ar: number;
}
interface IAchievement {
    key: string;
    name: string;
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
    last_study_date?: Date;
    current_streak_days: number;
    longest_streak_days: number;
}
export declare const userSchema: mongoose.Schema<IUser, mongoose.Model<IUser, any, any, any, mongoose.Document<unknown, any, IUser, any, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUser, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUser>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IUser> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare const UserModel: mongoose.Model<any, {}, {}, {}, any, any> | mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export type HUserDocument = HydratedDocument<IUser>;
export {};
//# sourceMappingURL=user.model.d.ts.map