"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middelware_1 = require("../../middelwares/authentication.middelware");
const user_authorization_1 = require("./user.authorization");
const user_service_1 = __importDefault(require("./user.service"));
const validation_middelware_1 = require("../../middelwares/validation.middelware");
const user_validation_1 = require("./user.validation");
const token_1 = require("../../utils/token/token");
const router = (0, express_1.Router)();
router.get('/getprofile', (0, authentication_middelware_1.authentication)(user_authorization_1.endpoints.profile), user_service_1.default.getProfile);
router.post('/signup-for-Child', (0, validation_middelware_1.Validation)(user_validation_1.SignUpForChildSchema), (0, authentication_middelware_1.authentication)(user_authorization_1.endpoints.SignupForChild), user_service_1.default.signupForChild);
router.post('/logout', (0, validation_middelware_1.Validation)(user_validation_1.logoutSchema), (0, authentication_middelware_1.authentication)(user_authorization_1.endpoints.logout), user_service_1.default.Logout);
router.post('/refresh-token', (0, authentication_middelware_1.authentication)(user_authorization_1.endpoints.refrehToken, token_1.TokenEnum.Refresh), user_service_1.default.refreshtoken);
exports.default = router;
//# sourceMappingURL=user.controller.js.map