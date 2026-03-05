import { z } from "zod";
export declare const UpdateMeSchema: {
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        username: z.ZodOptional<z.ZodString>;
        birthdate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        profileImage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
//# sourceMappingURL=user.validation.d.ts.map