import z from "zod";
import { ForgetPasswordSchema, LoginSchema, ResetPasswordSchema, SignUpSchema, confirmEmailSchema } from "./auth.validation";
export type SignupDto = z.infer<typeof SignUpSchema.body>;
export type ConfirmEmailDto = z.infer<typeof confirmEmailSchema.body>;
export type loginDto = z.infer<typeof LoginSchema.body>;
export type ForgetPasswordDto = z.infer<typeof ForgetPasswordSchema.body>;
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema.body>;
//# sourceMappingURL=auth.dto.d.ts.map