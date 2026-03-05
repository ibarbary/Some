import { z } from "zod";
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

export const UpdateChildSchema = {
  body: z
    .object({
      name: generalFields.name.optional(),
      username: generalFields.username.optional(),
      birthdate: z.coerce.date().optional(),
      profileImage: z.string().url().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
};

export const ChildIdParamSchema = {
  params: z.object({
    childId: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "childId must be a valid ID"),
  }),
};
