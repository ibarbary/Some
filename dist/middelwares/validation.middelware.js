"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.Validation = void 0;
const zod_1 = require("zod");
const error_response_1 = require("../utils/errors/error.response");
const user_model_1 = require("../DB/model/user.model");
const Validation = (schema) => {
    return (req, res, next) => {
        const ValidationError = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const ValidationResult = schema[key].safeParse(req[key]);
            if (!ValidationResult.success) {
                const error = ValidationResult.error;
                ValidationError.push({
                    key,
                    issues: error.issues.map((issue) => {
                        return { message: issue.message, path: issue.path };
                    })
                });
            }
            if (ValidationError.length > 0) {
                throw new error_response_1.BadRequestException("validation error", { cause: ValidationError });
            }
        }
        return next();
    };
};
exports.Validation = Validation;
exports.generalFields = {
    username: zod_1.z.string({ error: "username must be string" }).min(5, { error: "username must be at least 5 characters" }),
    name: zod_1.z.string({ error: "name must be string" }).min(3, { error: "name must be at least 3 characters" }),
    email: zod_1.z.email({ error: "email must be valid" }),
    password: zod_1.z.string().min(8, { error: "password must be at least 8 characters" }),
    confirmPassword: zod_1.z.string().min(8, { error: "confirmPassword must be at least 8 characters" }),
    role: zod_1.z.enum(user_model_1.RoleEnum).default(user_model_1.RoleEnum.User)
};
//# sourceMappingURL=validation.middelware.js.map