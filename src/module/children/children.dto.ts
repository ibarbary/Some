import z from "zod";
import {
  SignUpForChildSchema,
  UpdateChildSchema,
  ChildIdParamSchema,
} from "./children.validation";

export type CreateChildDto = z.infer<typeof SignUpForChildSchema.body>;
export type UpdateChildDto = z.infer<typeof UpdateChildSchema.body>;
export type ChildIdParamDto = z.infer<typeof ChildIdParamSchema.params>;
