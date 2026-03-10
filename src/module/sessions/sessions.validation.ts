import { z } from "zod";

export const StartSessionSchema = {
  body: z.strictObject({
    stage_id: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "stage_id must be a valid ID"),
    level_index: z
      .number()
      .int()
      .min(1, "level_index must be at least 1"),
  }),
};

export const HeartbeatSchema = {
  body: z.strictObject({
    session_id: z
      .string()
      .regex(
        /^[a-fA-F0-9]{24}$/,
        "session_id must be a valid ID",
      ),
  }),
};

export const EndSessionSchema = {
  body: z.strictObject({
    session_id: z
      .string()
      .regex(
        /^[a-fA-F0-9]{24}$/,
        "session_id must be a valid ID",
      ),
    accuracy: z
      .number()
      .min(0, "accuracy must be at least 0")
      .max(1, "accuracy must be at most 1"),
    completed: z.boolean().default(false),
  }),
};
