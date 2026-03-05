import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { endpoints } from "./user.authorization";
import userService from "./user.service";
import { Validation } from "../../middelwares/validation.middelware";
import { UpdateMeSchema } from "./user.validation";

const router: Router = Router();

// GET /me — learner's own profile + started stages + achievements
router.get("/me", authentication(endpoints.profile), userService.getMe);

// PATCH /me — update own profile
router.patch(
  "/me",
  Validation(UpdateMeSchema),
  authentication(endpoints.profile),
  userService.updateMe,
);

export default router;
