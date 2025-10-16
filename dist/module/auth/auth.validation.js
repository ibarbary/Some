"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordSchema = exports.ForgetPasswordSchema = exports.confirmEmailSchema = exports.LoginSchema = exports.SignUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_model_1 = require("../../DB/model/user.model");
const validation_middelware_1 = require("../../middelwares/validation.middelware");
exports.SignUpSchema = {
    body: zod_1.default.strictObject({
        name: validation_middelware_1.generalFields.name,
        username: validation_middelware_1.generalFields.username,
        email: validation_middelware_1.generalFields.email,
        password: validation_middelware_1.generalFields.password,
        role: zod_1.default.enum(user_model_1.RoleEnum).default(user_model_1.RoleEnum.User),
        birthdate: zod_1.default.coerce.date()
    })
};
exports.LoginSchema = {
    body: zod_1.default.strictObject({
        email: validation_middelware_1.generalFields.email,
        password: validation_middelware_1.generalFields.password,
    })
};
exports.confirmEmailSchema = {
    body: zod_1.default.strictObject({
        email: validation_middelware_1.generalFields.email,
        otp: zod_1.default.string().regex(/^\d{6}$/, { message: "OTP must be 6 numbers" }),
    })
};
exports.ForgetPasswordSchema = {
    body: zod_1.default.strictObject({
        email: validation_middelware_1.generalFields.email,
    })
};
exports.ResetPasswordSchema = {
    body: zod_1.default.strictObject({
        email: validation_middelware_1.generalFields.email,
        otp: zod_1.default.string().regex(/^\d{6}$/, { message: "OTP must be 6 numbers" }),
        password: validation_middelware_1.generalFields.password,
        confirmPassword: validation_middelware_1.generalFields.confirmPassword,
    }).superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "password and confirmPassword must be same",
                path: ["confirmPassword"]
            });
        }
    })
};
//# sourceMappingURL=auth.validation.js.map