import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { Validation } from "../../middelwares/validation.middelware";
import { endpoints } from "./activity.authorization";
import activityService from "./activity.service";
import { ActivityQuerySchema } from "./activity.validation";

const router: Router = Router();

// GET /activity/parent?limit=20
// Guardian calls this — gets recent activity for ALL their children
router.get(
  "/parent",
  Validation(ActivityQuerySchema),
  authentication(endpoints.getParentActivity),
  activityService.getParentActivity,
);

// GET /activity/me?limit=20
// Learner calls this — gets their own activity history
router.get(
  "/me",
  Validation(ActivityQuerySchema),
  authentication(endpoints.getLearnerActivity),
  activityService.getLearnerActivity,
);

export default router;
