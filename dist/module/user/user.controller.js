"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middelware_1 = require("../../middelwares/authentication.middelware");
const user_authorization_1 = require("./user.authorization");
const user_service_1 = __importDefault(require("./user.service"));
const router = (0, express_1.Router)();
router.get("/getProfile", (0, authentication_middelware_1.authentication)(user_authorization_1.endpoints.profile), user_service_1.default.getProfile);
exports.default = router;
//# sourceMappingURL=user.controller.js.map