import { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import { HUserDocument } from "../../DB/model/user.model";
import { RoleEnum } from "../../DB/model/user.model";
export declare enum TokenEnum {
    Access = "Access",
    Refresh = "Refresh"
}
export declare enum SignatureLevelEnum {
    User = "User",
    Child = "Child",
    Guardian = "Guardian"
}
export declare enum LogoutEnum {
    ALL = "ALL",
    ONLY = "ONLY"
}
export declare const generateToken: ({ payload, secret, options, }: {
    payload: object;
    secret?: Secret;
    options?: SignOptions;
}) => Promise<string>;
export declare const verifyToken: ({ token, secret, }: {
    token: string;
    secret?: Secret;
}) => Promise<JwtPayload>;
export declare const getSignaturesLevel: (role: RoleEnum) => Promise<SignatureLevelEnum>;
export declare const getSignature: (signatureLevel?: SignatureLevelEnum) => Promise<{
    accessSignature: string;
    refreshSignature: string;
}>;
export declare const createLoginCredentials: (user: HUserDocument) => Promise<{
    accestoken: string;
    refreshtoken: string;
}>;
export declare const decodedtoken: ({ authorization, tokenType }: {
    authorization: string;
    tokenType?: TokenEnum;
}) => Promise<{
    user: any;
    decoded: JwtPayload;
}>;
export declare const revokeToken: (decoded: JwtPayload) => Promise<import("mongoose").Document<unknown, {}, import("../../DB/model/token.model").IToken, {}, {}> & import("../../DB/model/token.model").IToken & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=token.d.ts.map