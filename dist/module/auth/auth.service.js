"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repositiories_1 = require("../../DB/repositories/user.repositiories");
const user_pending_model_1 = require("../../DB/model/user.pending.model");
const user_model_1 = require("../../DB/model/user.model");
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const error_response_1 = require("../../utils/errors/error.response");
const hash_1 = require("../../utils/security/hash");
const email_event_1 = require("../../utils/email/email.event");
const generateotp_1 = require("../../utils/generateotp/generateotp");
const token_1 = require("../../utils/token/token");
const generateUsername_1 = __importDefault(require("../../utils/generateUsername"));
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthenticationService {
    UserModel_pending = new user_repositiories_1.userRepository(user_pending_model_1.UserModel_pending);
    _UserModel = new user_repositiories_1.userRepository(user_model_1.UserModel);
    constructor() { }
    oauthLogin = async (req, res) => {
        const { provider, token, role } = req.body;
        let userData;
        if (provider === "google") {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new error_response_1.BadRequestException("Invalid Google token");
            }
            userData = {
                email: payload.email,
                name: payload.name,
                providerId: payload.sub,
                profileImage: payload.picture,
            };
        }
        else if (provider === "facebook") {
            const fbRes = await axios_1.default.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
            const data = fbRes.data;
            if (!data.email) {
                throw new error_response_1.BadRequestException("Invalid Facebook token");
            }
            userData = {
                email: data.email,
                name: data.name,
                providerId: data.id,
                profileImage: data.picture?.data?.url,
            };
        }
        else {
            throw new error_response_1.BadRequestException("Invalid provider");
        }
        let user = await this._UserModel.findone({
            filter: { email: userData.email },
        });
        if (!user) {
            user = await this._UserModel.createUser({
                data: [
                    {
                        name: userData.name,
                        username: (0, generateUsername_1.default)(userData.name, userData.email),
                        email: userData.email,
                        provider,
                        providerId: userData.providerId,
                        profileImage: userData.profileImage,
                        role,
                    },
                ],
            });
        }
        const Credentials = await (0, token_1.createLoginCredentials)(user);
        return res.status(200).json({ message: "Login success", Credentials });
    };
    signup = async (req, res) => {
        const { name, username, email, password, role, birthdate } = req.body;
        const existingUser = await this._UserModel.findone({
            filter: { email },
        });
        if (existingUser) {
            throw new error_response_1.BadRequestException("User already exists");
        }
        await this.UserModel_pending.deleteOne({ filter: { email } });
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
        await (0, email_event_1.sendConfirmEmail)({ to: email, username, otp });
        return res.status(201).json({
            message: "Signup successful. A confirmation email has been sent.",
        });
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
        return res.status(200).json({
            message: "user logged in successfully",
            Credentials,
        });
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
            .json({ message: "user logged in successfully", Credentials });
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
            update: {
                forgetPasswordOtp: await (0, hash_1.hashtext)(String(otp)),
                forgetPasswordOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
            },
        });
        await (0, email_event_1.sendForgotPasswordEmail)({
            to: email,
            username: user.username,
            otp,
        });
        return res.status(200).json({ message: "otp sent successfully" });
    };
    verifyForgotOtp = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this._UserModel.findone({ filter: { email } });
        if (!user) {
            throw new error_response_1.NotFoundException("user not found");
        }
        if (!user.forgetPasswordOtp || !user.forgetPasswordOtpExpires) {
            throw new error_response_1.BadRequestException("no OTP found or expired");
        }
        if (new Date() > new Date(user.forgetPasswordOtpExpires)) {
            await this._UserModel.updateOne({
                filter: { email },
                update: {
                    $unset: { forgetPasswordOtp: 1, forgetPasswordOtpExpires: 1 },
                },
            });
            throw new error_response_1.BadRequestException("OTP expired");
        }
        const isMatch = await (0, hash_1.compareText)(otp, user.forgetPasswordOtp);
        if (!isMatch) {
            throw new error_response_1.BadRequestException("invalid OTP");
        }
        const resetToken = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "5m",
        });
        return res.status(200).json({
            message: "OTP verified successfully",
            resetToken,
        });
    };
    ResetPassword = async (req, res) => {
        const { password, confirmPassword } = req.body;
        const resetToken = req.headers.authorization?.split(" ")[1];
        if (!resetToken) {
            throw new error_response_1.UnauthorizedException("Missing reset token");
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(resetToken, process.env.JWT_SECRET);
        }
        catch {
            throw new error_response_1.UnauthorizedException("Invalid or expired reset token");
        }
        if (password !== confirmPassword) {
            throw new error_response_1.BadRequestException("Passwords do not match");
        }
        const user = await this._UserModel.findone({
            filter: { email: decoded.email },
        });
        if (!user) {
            throw new error_response_1.NotFoundException("User not found");
        }
        await this._UserModel.updateOne({
            filter: { email: decoded.email },
            update: {
                password: await (0, hash_1.hashtext)(password),
                $unset: { forgetPasswordOtp: 1, forgetPasswordOtpExpires: 1 },
            },
        });
        return res.status(200).json({ message: "Password reset successfully" });
    };
    Logout = async (req, res) => {
        if (!req.decoded) {
            throw new error_response_1.UnauthorizedException("No active session found");
        }
        await (0, token_1.revokeToken)(req.decoded);
        return res.status(200).json({ message: "Logged out successfully" });
    };
    refreshtoken = async (req, res) => {
        const credentials = await (0, token_1.createLoginCredentials)(req.user);
        await (0, token_1.revokeToken)(req.decoded);
        return res.status(200).json({ message: "new Credentials", credentials });
    };
}
exports.default = new AuthenticationService();
//# sourceMappingURL=auth.service.js.map