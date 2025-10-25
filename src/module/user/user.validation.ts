import z from "zod";
import { generalFields } from "../../middelwares/validation.middelware";

export const SignUpForChildSchema = {
  body: z.strictObject({
    name: generalFields.name,
    username: generalFields.username,
    email: generalFields.email,
    password: generalFields.password,
    birthdate: z.coerce.date(),
  }),
};