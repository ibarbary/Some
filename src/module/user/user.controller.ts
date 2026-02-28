import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { endpoints } from "./user.authorization";
import userService from "./user.service";
import { Validation } from "../../middelwares/validation.middelware";

const router: Router = Router();

router.get(
  "/getProfile",
  authentication(endpoints.profile),
  userService.getProfile
);

export default router;
