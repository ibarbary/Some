"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMeSchema = void 0;
const zod_1 = require("zod");
const validation_middelware_1 = require("../../middelwares/validation.middelware");
exports.UpdateMeSchema = {
    body: zod_1.z
        .object({
        name: validation_middelware_1.generalFields.name.optional(),
        username: validation_middelware_1.generalFields.username.optional(),
        birthdate: zod_1.z.coerce.date().optional(),
        profileImage: zod_1.z.string().url().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required",
    }),
};
//# sourceMappingURL=user.validation.js.map