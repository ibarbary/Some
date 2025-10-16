import mongoose, { Types, HydratedDocument } from "mongoose";
export declare enum RoleEnum {
    User = "User",
    Guardian = " Guardian",
    Child = "Child"
}
export interface IUser {
    _id: Types.ObjectId;
    name: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    confirmEmailOtp: string;
    forgetPasswordOtp: string;
    changeCredentialsTime: Date;
    birthdate: Date;
    role: RoleEnum;
    parentId?: Types.ObjectId;
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
//# sourceMappingURL=user.model.d.ts.map