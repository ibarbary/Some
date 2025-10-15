import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { z } from "zod";
import { RoleEnum } from "../DB/model/user.model";
type SchemaType = Partial<Record<ReqTypeKey, ZodType>>;
type ReqTypeKey = keyof Request;
export declare const Validation: (schema: SchemaType) => (req: Request, res: Response, next: NextFunction) => NextFunction;
export declare const generalFields: {
    username: z.ZodString;
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<typeof RoleEnum>>;
};
export {};
//# sourceMappingURL=validation.middelware.d.ts.map