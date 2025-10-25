import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { endpoints } from "./user.authorization";
import userService from "./user.service";
import { Validation } from "../../middelwares/validation.middelware";
import {  SignUpForChildSchema } from "./user.validation";

const router: Router = Router();

router.get(
  "/getProfile",
  authentication(endpoints.profile),
  userService.getProfile
);

router.post(
  "/signup-for-Child",
  Validation(SignUpForChildSchema),
  authentication(endpoints.SignupForChild),
  userService.signupForChild
);

export default router;
