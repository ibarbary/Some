import z from "zod"
import { SignUpForChildSchema } from "./user.validation"
export type SignupForChildDto = z.infer<typeof SignUpForChildSchema.body>