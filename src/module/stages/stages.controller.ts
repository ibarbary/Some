import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { Validation } from "../../middelwares/validation.middelware";
import { endpoints } from "./stages.authorization";
import stagesService from "./stages.service";
import { GetStagesSchema, StageIdParamSchema } from "./stages.validation";

const router: Router = Router();

// GET /stages?language=en|ar
// Returns all stages for a language + learner's progress for each
router.get(
  "/",
  Validation(GetStagesSchema),
  authentication(endpoints.getStages),
  stagesService.getStages,
);

// POST /stages/:stageId/start
// First time entering a stage — creates LearnerStageProgress
router.post(
  "/:stageId/start",
  Validation(StageIdParamSchema),
  authentication(endpoints.startStage),
  stagesService.startStage,
);

// GET /stages/:stageId/levels
// Returns all LearnerLevelProgress records for this learner in this stage
router.get(
  "/:stageId/levels",
  Validation(StageIdParamSchema),
  authentication(endpoints.getLevelProgress),
  stagesService.getLevelProgress,
);

export default router;
