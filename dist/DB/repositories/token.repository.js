"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepository = void 0;
const databas_repositories_1 = require("./databas.repositories");
class TokenRepository extends databas_repositories_1.DatabaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
}
exports.TokenRepository = TokenRepository;
//# sourceMappingURL=token.repository.js.map