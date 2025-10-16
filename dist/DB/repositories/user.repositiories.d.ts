import { Model, CreateOptions, HydratedDocument } from "mongoose";
import { DatabaseRepository } from "./databas.repositories";
import { IUser } from "../model/user.model";
export declare class userRepository extends DatabaseRepository<IUser> {
    protected readonly model: Model<IUser>;
    constructor(model: Model<IUser>);
    createUser({ data, options, }: {
        data: Partial<IUser>[];
        options?: CreateOptions;
    }): Promise<HydratedDocument<IUser>>;
}
//# sourceMappingURL=user.repositiories.d.ts.map