import { z } from "zod";
import { generalFields } from "../../middelwares/validation.middelware";

export const UpdateMeSchema = {
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
