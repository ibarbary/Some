import { z } from "zod";
import {
  StartSessionSchema,
  HeartbeatSchema,
  EndSessionSchema,
} from "./sessions.validation";

export type StartSessionDto = z.infer<typeof StartSessionSchema.body>;
export type HeartbeatDto = z.infer<typeof HeartbeatSchema.body>;
export type EndSessionDto = z.infer<typeof EndSessionSchema.body>;
