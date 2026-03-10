import { z } from "zod";

export const GetStagesSchema = {
  query: z.object({
    language: z.enum(["en", "ar"], {
      message: "language must be 'en' or 'ar'",
    }),
  }),
};

export const StageIdParamSchema = {
  params: z.object({
    stageId: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "stageId must be a valid ID"),
  }),
};
