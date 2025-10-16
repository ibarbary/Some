"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.SignUpForChildSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const validation_middelware_1 = require("../../middelwares/validation.middelware");
const token_1 = require("../../utils/token/token");
exports.SignUpForChildSchema = {
    body: zod_1.default.strictObject({
        name: validation_middelware_1.generalFields.name,
        username: validation_middelware_1.generalFields.username,
        email: validation_middelware_1.generalFields.email,
        password: validation_middelware_1.generalFields.password,
        birthdate: zod_1.default.coerce.date()
    })
};
exports.logoutSchema = {
    body: zod_1.default.strictObject({
        flag: zod_1.default.enum(token_1.LogoutEnum).default(token_1.LogoutEnum.ALL)
    })
};
//# sourceMappingURL=user.validation.js.map