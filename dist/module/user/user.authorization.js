"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoints = void 0;
const user_model_1 = require("../../DB/model/user.model");
exports.endpoints = {
    profile: [user_model_1.RoleEnum.Child, user_model_1.RoleEnum.Guardian, user_model_1.RoleEnum.User],
    SignupForChild: [user_model_1.RoleEnum.Guardian],
    delete: [user_model_1.RoleEnum.Child, user_model_1.RoleEnum.Guardian, user_model_1.RoleEnum.User],
    update: [user_model_1.RoleEnum.Child, user_model_1.RoleEnum.Guardian, user_model_1.RoleEnum.User],
};
//# sourceMappingURL=user.authorization.js.map