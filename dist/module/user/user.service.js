"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repositiories_1 = require("../../DB/repositories/user.repositiories");
const user_model_1 = require("../../DB/model/user.model");
const error_response_1 = require("../../utils/errors/error.response");
const token_1 = require("../../utils/token/token");
class UserService {
    _UserModel = new user_repositiories_1.userRepository(user_model_1.UserModel);
    constructor() { }
    getProfile = async (req, res) => {
        return res.status(200).json({ message: "profile", user: req.user, decoded: req.decoded });
    };
    signupForChild = async (req, res) => {
        const { name, username, email, password, birthdate } = req.body;
        const checkuser = await this._UserModel.findone({
            filter: { email },
        });
        if (checkuser) {
            throw new error_response_1.BadRequestException("user already exist with this email");
        }
        if (!req.user) {
            throw new error_response_1.BadRequestException("Parent user not found");
        }
        const user = await this._UserModel.createUser({
            data: [{ name, username, email, password, birthdate, role: user_model_1.RoleEnum.Child, parentId: req.user._id }],
            options: { validateBeforeSave: true },
        });
        const credentials = await (0, token_1.createLoginCredentials)(user);
        return res.status(201).json({ message: "child Created Successfully", credentials });
    };
    Logout = async (req, res) => {
        const { flag } = req.body;
        let statusCode = 200;
        const update = {};
        switch (flag) {
            case token_1.LogoutEnum.ALL:
                update.changeCredentialsTime = new Date();
                break;
            case token_1.LogoutEnum.ONLY:
                await (0, token_1.revokeToken)(req.decoded);
                statusCode = 201;
                break;
            default:
                break;
        }
        await this._UserModel.updateOne({ filter: { _id: req.decoded?._id }, update });
        return res.status(statusCode).json({ message: "done" });
    };
    refreshtoken = async (req, res) => {
        const credentials = await (0, token_1.createLoginCredentials)(req.user);
        await (0, token_1.revokeToken)(req.decoded);
        return res.status(200).json({ message: "new Credentials", credentials });
    };
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map