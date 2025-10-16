import { Model } from "mongoose";
import { DatabaseRepository } from "./databas.repositories";
import { IToken } from "../model/token.model";
export declare class TokenRepository extends DatabaseRepository<IToken> {
    protected readonly model: Model<IToken>;
    constructor(model: Model<IToken>);
}
//# sourceMappingURL=token.repository.d.ts.map