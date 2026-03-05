import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { Validation } from "../../middelwares/validation.middelware";
import { endpoints } from "./sessions.authorization";
import sessionsService from "./sessions.service";
import {
  StartSessionSchema,
  HeartbeatSchema,
  EndSessionSchema,
} from "./sessions.validation";

const router: Router = Router();

// POST /sessions/start
// Flutter calls this when user taps "Play" on a level
router.post(
  "/start",
  Validation(StartSessionSchema),
  authentication(endpoints.startSession),
  sessionsService.startSession,
);

// POST /sessions/heartbeat
// Flutter calls this every 30s while game is running
router.post(
  "/heartbeat",
  Validation(HeartbeatSchema),
  authentication(endpoints.heartbeat),
  sessionsService.heartbeat,
);

// POST /sessions/end
// Flutter calls this when level finishes OR when session is abandoned
router.post(
  "/end",
  Validation(EndSessionSchema),
  authentication(endpoints.endSession),
  sessionsService.endSession,
);

export default router;
