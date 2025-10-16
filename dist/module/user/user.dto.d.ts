import z from "zod";
import { logoutSchema, SignUpForChildSchema } from "./user.validation";
export type SignupForChildDto = z.infer<typeof SignUpForChildSchema.body>;
export type LogoutDto = z.infer<typeof logoutSchema.body>;
//# sourceMappingURL=user.dto.d.ts.map