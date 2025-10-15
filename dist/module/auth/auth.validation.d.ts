import z from "zod";
import { RoleEnum } from "../../DB/model/user.model";
export declare const SignUpSchema: {
    body: z.ZodObject<{
        name: z.ZodString;
        username: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
        role: z.ZodDefault<z.ZodEnum<typeof RoleEnum>>;
        birthdate: z.ZodCoercedDate<unknown>;
    }, z.core.$strict>;
};
export declare const LoginSchema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strict>;
};
export declare const confirmEmailSchema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        otp: z.ZodString;
    }, z.core.$strict>;
};
export declare const ForgetPasswordSchema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
    }, z.core.$strict>;
};
export declare const ResetPasswordSchema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        otp: z.ZodString;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strict>;
};
//# sourceMappingURL=auth.validation.d.ts.map