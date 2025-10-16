import mongoose, { HydratedDocument, Types } from "mongoose";
export interface IToken {
    jti: string;
    expiresIn: number;
    userId: Types.ObjectId;
}
export declare const tokenSchema: mongoose.Schema<IToken, mongoose.Model<IToken, any, any, any, mongoose.Document<unknown, any, IToken, any, {}> & IToken & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IToken, mongoose.Document<unknown, {}, mongoose.FlatRecord<IToken>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IToken> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const TokenModel: mongoose.Model<any, {}, {}, {}, any, any> | mongoose.Model<IToken, {}, {}, {}, mongoose.Document<unknown, {}, IToken, {}, {}> & IToken & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export type HTokenDocument = HydratedDocument<IToken>;
//# sourceMappingURL=token.model.d.ts.map