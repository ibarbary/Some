import { z } from "zod";
import { ActivityQuerySchema } from "./activity.validation";

export type ActivityQueryDto = z.infer<typeof ActivityQuerySchema.query>;
