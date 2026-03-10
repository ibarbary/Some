import { z } from "zod";

export const ActivityQuerySchema = {
  query: z.object({
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 20))
      .refine((val) => val > 0 && val <= 100, {
        message: "limit must be between 1 and 100",
      }),
  }),
};
