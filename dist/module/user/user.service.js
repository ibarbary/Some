"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repositiories_1 = require("../../DB/repositories/user.repositiories");
const user_model_1 = require("../../DB/model/user.model");
class UserService {
    _UserModel = new user_repositiories_1.userRepository(user_model_1.UserModel);
    constructor() { }
    getProfile = async (req, res) => {
        return res
            .status(200)
            .json({ message: "profile", user: req.user, decoded: req.decoded });
    };
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map