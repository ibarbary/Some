import { z } from "zod";

// ── GET /stages?language=en ────────────────────────────────────
export const GetStagesSchema = {
  query: z.object({
    language: z.enum(["en", "ar"], {
      message: "language must be 'en' or 'ar'",
    }),
  }),
};

// ── POST /stages/:stageId/start ───────────────────────────────
export const StageIdParamSchema = {
  params: z.object({
    stageId: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "stageId must be a valid ID"),
  }),
};

// ── GET /stages/:stageId/levels ───────────────────────────────
// reuses StageIdParamSchema — no extra body/query needed
