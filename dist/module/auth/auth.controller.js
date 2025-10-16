"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const validation_middelware_1 = require("../../middelwares/validation.middelware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post('/signup', (0, validation_middelware_1.Validation)(auth_validation_1.SignUpSchema), auth_service_1.default.signup);
router.post('/confirmEmail', (0, validation_middelware_1.Validation)(auth_validation_1.confirmEmailSchema), auth_service_1.default.confirmEmail);
router.post('/login', (0, validation_middelware_1.Validation)(auth_validation_1.LoginSchema), auth_service_1.default.login);
router.patch('/forget-password', (0, validation_middelware_1.Validation)(auth_validation_1.ForgetPasswordSchema), auth_service_1.default.forgetPassword);
router.patch('/reset-password', (0, validation_middelware_1.Validation)(auth_validation_1.ResetPasswordSchema), auth_service_1.default.ResetPassword);
exports.default = router;
//# sourceMappingURL=auth.controller.js.map