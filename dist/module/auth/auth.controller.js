"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const validation_middelware_1 = require("../../middelwares/validation.middelware");
const auth_validation_1 = require("./auth.validation");
const authentication_middelware_1 = require("../../middelwares/authentication.middelware");
const token_1 = require("../../utils/token/token");
const auth_authorization_1 = require("./auth.authorization");
const router = (0, express_1.Router)();
router.post("/signup", (0, validation_middelware_1.Validation)(auth_validation_1.SignUpSchema), auth_service_1.default.signup);
router.post("/oauth", (0, validation_middelware_1.Validation)(auth_validation_1.OAuthSchema), auth_service_1.default.oauthLogin);
router.post("/confirmEmail", (0, validation_middelware_1.Validation)(auth_validation_1.confirmEmailSchema), auth_service_1.default.confirmEmail);
router.post("/login", (0, validation_middelware_1.Validation)(auth_validation_1.LoginSchema), auth_service_1.default.login);
router.post("/forget-password", (0, validation_middelware_1.Validation)(auth_validation_1.ForgetPasswordSchema), auth_service_1.default.forgetPassword);
router.post("/verify-forgot-otp", (0, validation_middelware_1.Validation)(auth_validation_1.VerifyOtpSchema), auth_service_1.default.verifyForgotOtp);
router.patch("/reset-password", (0, validation_middelware_1.Validation)(auth_validation_1.ResetPasswordSchema), auth_service_1.default.ResetPassword);
router.post("/logout", (0, authentication_middelware_1.authentication)(auth_authorization_1.endpoints.logout), auth_service_1.default.Logout);
router.post("/refresh-token", (0, authentication_middelware_1.authentication)(auth_authorization_1.endpoints.refreshToken, token_1.TokenEnum.Refresh), auth_service_1.default.refreshtoken);
exports.default = router;
//# sourceMappingURL=auth.controller.js.map