"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoints = void 0;
const user_model_1 = require("../../DB/model/user.model");
exports.endpoints = {
    profile: [user_model_1.RoleEnum.User, user_model_1.RoleEnum.Child],
};
//# sourceMappingURL=user.authorization.js.map