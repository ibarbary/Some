"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repositiories_1 = require("../../DB/repositories/user.repositiories");
const user_pending_model_1 = require("../../DB/model/user.pending.model");
const error_response_1 = require("../../utils/errors/error.response");
const hash_1 = require("../../utils/security/hash");
const email_event_1 = require("../../utils/email/email.event");
const generateotp_1 = require("../../utils/generateotp/generateotp");
const user_model_1 = require("../../DB/model/user.model");
const token_1 = require("../../utils/token/token");
class AuthenticationService {
    UserModel_pending = new user_repositiories_1.userRepository(user_pending_model_1.UserModel_pending);
    _UserModel = new user_repositiories_1.userRepository(user_model_1.UserModel);
    constructor() { }
    signup = async (req, res, next) => {
        const { name, username, email, password, role, birthdate } = req.body;
        const checkuser = await this.UserModel_pending.findone({
            filter: { email },
        });
        if (checkuser) {
            throw new error_response_1.BadRequestException("user already exist");
        }
        const otp = (0, generateotp_1.generateOtp)();
        const user = (await this.UserModel_pending.createUser({
            data: [
                {
                    name,
                    username,
                    email,
                    password: await (0, hash_1.hashtext)(password),
                    role,
                    confirmEmailOtp: await (0, hash_1.hashtext)(String(otp)),
                    birthdate,
                },
            ],
            options: { validateBeforeSave: true },
        })) || [];
        if (!user) {
            throw new error_response_1.BadRequestException("user not created");
        }
        email_event_1.emailEvent.emit("confirmEmail", { to: email, username, otp });
        return res.status(201).json({ message: "user created suuccess", user });
    };
    confirmEmail = async (req, res) => {
        const { otp, email } = req.body;
        const pending_user = await this.UserModel_pending.findone({
            filter: { email },
        });
        if (!pending_user) {
            throw new error_response_1.NotFoundException("user not found");
        }
        if (!(0, hash_1.compareText)(otp, pending_user.confirmEmailOtp)) {
            throw new error_response_1.BadRequestException("otp is not valid");
        }
        const user = await this._UserModel.createUser({
            data: [
                {
                    name: pending_user.name,
                    username: pending_user.username,
                    email: pending_user.email,
                    password: pending_user.password,
                    role: pending_user.role,
                    birthdate: pending_user.birthdate,
                },
            ],
        });
        await this.UserModel_pending.deleteOne({ filter: { email } });
        const Credentials = await (0, token_1.createLoginCredentials)(user);
        return res
            .status(200)
            .json({ message: "user loged in success", Credentials });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await this._UserModel.findone({ filter: { email } });
        if (!user) {
            throw new error_response_1.NotFoundException("user not found");
        }
        if (!(await (0, hash_1.compareText)(password, user.password))) {
            throw new error_response_1.BadRequestException("password is not valid");
        }
        const Credentials = await (0, token_1.createLoginCredentials)(user);
        return res
            .status(200)
            .json({ message: "user loged in success", Credentials });
    };
    forgetPassword = async (req, res) => {
        const { email } = req.body;
        const user = await this._UserModel.findone({ filter: { email } });
        if (!user) {
            throw new error_response_1.NotFoundException("user not found");
        }
        const otp = (0, generateotp_1.generateOtp)();
        await this._UserModel.updateOne({
            filter: { email },
            update: { forgetPasswordOtp: await (0, hash_1.hashtext)(String(otp)) },
        });
        email_event_1.emailEvent.emit("forgotPassword", {
            to: email,
            username: user.username,
            otp,
        });
        return res.status(200).json({ message: "otp sent Success" });
    };
    ResetPassword = async (req, res) => {
        const { email, password, otp, confirmPassword } = req.body;
        const user = await this._UserModel.findone({ filter: { email } });
        if (!user) {
            throw new error_response_1.NotFoundException("user not found");
        }
        if (!(await (0, hash_1.compareText)(otp, user.forgetPasswordOtp))) {
            throw new error_response_1.BadRequestException("otp is invalid");
        }
        if (password !== confirmPassword) {
            throw new error_response_1.BadRequestException("password and confirmPassword must be same");
        }
        await this._UserModel.updateOne({
            filter: { email },
            update: { password: await (0, hash_1.hashtext)(password), $unset: { forgetPasswordOtp: 1 } },
        });
        return res.status(200).json({ message: "password reset Success" });
    };
}
exports.default = new AuthenticationService();
//# sourceMappingURL=auth.service.js.map