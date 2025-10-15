import { NextFunction, Request, Response } from "express";
import { TokenEnum } from "../utils/token/token";
import { RoleEnum } from "../DB/model/user.model";
export declare const authentication: (accessRole?: RoleEnum[], tokenType?: TokenEnum) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authentication.middelware.d.ts.map