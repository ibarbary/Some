"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.userSchema = exports.RoleEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["User"] = "User";
    RoleEnum["Guardian"] = " Guardian";
    RoleEnum["Child"] = "Child";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
exports.userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, min: 8 },
    confirmEmailOtp: { type: String, min: 6 },
    changeCredentialsTime: Date,
    forgetPasswordOtp: { type: String, min: 6 },
    birthdate: { type: Date, required: true },
    role: { type: String, enum: Object.values(RoleEnum), default: RoleEnum.User },
    parentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: false }
}, { timestamps: true });
//give me user object to use for postman
//{ "name": "John Doe", "username": "johndoe", "email": "johndoe@example.com", "password": "password123", "birthdate": "2000-01-01", "role": "User" }
exports.UserModel = mongoose_1.models.User || mongoose_1.default.model("User", exports.userSchema);
//# sourceMappingURL=user.model.js.map