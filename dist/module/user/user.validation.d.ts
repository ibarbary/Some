import z from "zod";
import { LogoutEnum } from "../../utils/token/token";
export declare const SignUpForChildSchema: {
    body: z.ZodObject<{
        name: z.ZodString;
        username: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
        birthdate: z.ZodCoercedDate<unknown>;
    }, z.core.$strict>;
};
export declare const logoutSchema: {
    body: z.ZodObject<{
        flag: z.ZodDefault<z.ZodEnum<typeof LogoutEnum>>;
    }, z.core.$strict>;
};
//# sourceMappingURL=user.validation.d.ts.map