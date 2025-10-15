"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeToken = exports.decodedtoken = exports.createLoginCredentials = exports.getSignature = exports.getSignaturesLevel = exports.verifyToken = exports.generateToken = exports.LogoutEnum = exports.SignatureLevelEnum = exports.TokenEnum = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = require("../../DB/model/user.model");
const user_model_2 = require("../../DB/model/user.model");
const error_response_1 = require("../errors/error.response");
const user_repositiories_1 = require("../../DB/repositories/user.repositiories");
const uuid_1 = require("uuid");
const token_repository_1 = require("../../DB/repositories/token.repository");
const token_model_1 = require("../../DB/model/token.model");
var TokenEnum;
(function (TokenEnum) {
    TokenEnum["Access"] = "Access";
    TokenEnum["Refresh"] = "Refresh";
})(TokenEnum || (exports.TokenEnum = TokenEnum = {}));
var SignatureLevelEnum;
(function (SignatureLevelEnum) {
    SignatureLevelEnum["User"] = "User";
    SignatureLevelEnum["Child"] = "Child";
    SignatureLevelEnum["Guardian"] = "Guardian";
})(SignatureLevelEnum || (exports.SignatureLevelEnum = SignatureLevelEnum = {}));
var LogoutEnum;
(function (LogoutEnum) {
    LogoutEnum["ALL"] = "ALL";
    LogoutEnum["ONLY"] = "ONLY";
})(LogoutEnum || (exports.LogoutEnum = LogoutEnum = {}));
const generateToken = async ({ payload, secret = process.env.ACCESS_USER_SIGNATURE, options = { expiresIn: Number(process.env.ACCESS_EXPIRES_IN) }, }) => {
    return await (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generateToken = generateToken;
const verifyToken = async ({ token, secret = process.env.ACCESS_USER_SIGNATURE, }) => {
    return await (0, jsonwebtoken_1.verify)(token, secret);
};
exports.verifyToken = verifyToken;
const getSignaturesLevel = async (role) => {
    let SignatureLevel = SignatureLevelEnum.User;
    switch (role) {
        case user_model_2.RoleEnum.User:
            SignatureLevel = SignatureLevelEnum.User;
            break;
        case user_model_2.RoleEnum.Guardian:
            SignatureLevel = SignatureLevelEnum.Guardian;
            break;
        case user_model_2.RoleEnum.Child:
            SignatureLevel = SignatureLevelEnum.Child;
            break;
        default:
            break;
    }
    return SignatureLevel;
};
exports.getSignaturesLevel = getSignaturesLevel;
const getSignature = async (signatureLevel = SignatureLevelEnum.User) => {
    let Signature = { accessSignature: "", refreshSignature: "" };
    switch (signatureLevel) {
        case SignatureLevelEnum.User:
            Signature.accessSignature = process.env.ACCESS_USER_SIGNATURE;
            Signature.refreshSignature = process.env.REFRESH_USER_SIGNATURE;
            break;
        case SignatureLevelEnum.Guardian:
            Signature.accessSignature = process.env.ACCESS_GUARDIAN_SIGNATURE;
            Signature.refreshSignature = process.env.REFRESH_GUARDIAN_SIGNATURE;
            break;
        case SignatureLevelEnum.Child:
            Signature.accessSignature = process.env.ACCESS_CHILD_SIGNATURE;
            Signature.refreshSignature = process.env.REFRESH_CHILD_SIGNATURE;
            break;
        default:
            break;
    }
    return Signature;
};
exports.getSignature = getSignature;
const createLoginCredentials = async (user) => {
    const SignatureLevel = await (0, exports.getSignaturesLevel)(user.role);
    const Signature = await (0, exports.getSignature)(SignatureLevel);
    const jwtid = (0, uuid_1.v4)();
    const accestoken = await (0, exports.generateToken)({
        payload: { _id: user._id },
        secret: Signature.accessSignature,
        options: { expiresIn: Number(process.env.ACCESS_EXPIRES_IN), jwtid }
    });
    const refreshtoken = await (0, exports.generateToken)({
        payload: { _id: user._id },
        secret: Signature.refreshSignature,
        options: { expiresIn: Number(process.env.REFRESH_EXPIRES_IN), jwtid }
    });
    return { accestoken, refreshtoken };
};
exports.createLoginCredentials = createLoginCredentials;
const decodedtoken = async ({ authorization, tokenType = TokenEnum.Access }) => {
    const usermodel = new user_repositiories_1.userRepository(user_model_1.UserModel);
    const [bearer, token] = authorization.split(" ");
    const tokenmodel = new token_repository_1.TokenRepository(token_model_1.TokenModel);
    if (!bearer || !token) {
        throw new error_response_1.UnauthorizedException("token not found");
    }
    const Signature = await (0, exports.getSignature)(bearer);
    const decoded = await (0, exports.verifyToken)({ token, secret: tokenType === TokenEnum.Access ? Signature.accessSignature : Signature.refreshSignature });
    if (!decoded?._id || !decoded?.iat) {
        throw new error_response_1.UnauthorizedException("invalid token decoded");
    }
    if (await tokenmodel.findone({ filter: { jti: decoded.jti } })) {
        throw new error_response_1.UnauthorizedException("token already used");
    }
    const user = await usermodel.findone({ filter: { _id: decoded._id } });
    if (!user) {
        throw new error_response_1.UnauthorizedException("user not found");
    }
    if (user?.changeCredentialsTime || 0 > decoded.iat * 1000) {
        throw new error_response_1.UnauthorizedException("token expired");
    }
    return { user, decoded };
};
exports.decodedtoken = decodedtoken;
const revokeToken = async (decoded) => {
    const tokenmodel = new token_repository_1.TokenRepository(token_model_1.TokenModel);
    const [result] = await tokenmodel.create({ data: [{
                jti: decoded?.jti,
                expiresIn: decoded?.iat + Number(process.env.REFRESH_EXPIRES_IN),
                userId: decoded?._id
            }], options: { validateBeforeSave: true } }) || [];
    if (!result) {
        throw new error_response_1.UnauthorizedException("failed to revoke token");
    }
    return result;
};
exports.revokeToken = revokeToken;
//# sourceMappingURL=token.js.map