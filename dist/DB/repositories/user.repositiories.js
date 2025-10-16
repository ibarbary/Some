"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const databas_repositories_1 = require("./databas.repositories");
const error_response_1 = require("../../utils/errors/error.response");
class userRepository extends databas_repositories_1.DatabaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
    async createUser({ data, options, }) {
        const [user] = await this.create({ data, options }) || [];
        if (!user) {
            throw new error_response_1.BadRequestException('user not created');
        }
        return user;
    }
}
exports.userRepository = userRepository;
//# sourceMappingURL=user.repositiories.js.map