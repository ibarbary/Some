import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { endpoints } from "./user.authorization";
import userService from "./user.service";
import { Validation } from "../../middelwares/validation.middelware";
import { UpdateMeSchema } from "./user.validation";

const router: Router = Router();

router.get("/me", authentication(endpoints.profile), userService.getMe);
router.patch(
  "/me",
  Validation(UpdateMeSchema),
  authentication(endpoints.profile),
  userService.updateMe,
);

export default router;
