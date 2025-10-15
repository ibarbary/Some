"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const error_response_1 = require("../utils/errors/error.response");
const token_1 = require("../utils/token/token");
const authentication = (accessRole = [], tokenType = token_1.TokenEnum.Access) => {
    return async (req, res, next) => {
        if (!req.headers.authorization) {
            throw new error_response_1.BadRequestException("missing token in headers");
        }
        const { decoded, user } = await (0, token_1.decodedtoken)({ authorization: req.headers.authorization, tokenType });
        if (!accessRole.includes(user.role)) {
            throw new error_response_1.BadRequestException("user not authorized");
        }
        // beare token
        req.user = user;
        req.decoded = decoded;
        next();
    };
};
exports.authentication = authentication;
//# sourceMappingURL=authentication.middelware.js.map