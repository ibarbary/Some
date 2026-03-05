import { z } from "zod";
import { GetStagesSchema, StageIdParamSchema } from "./stages.validation";

export type GetStagesQueryDto = z.infer<typeof GetStagesSchema.query>;
export type StageIdParamDto = z.infer<typeof StageIdParamSchema.params>;
