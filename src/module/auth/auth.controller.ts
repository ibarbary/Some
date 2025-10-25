import { Router } from "express";
import authService from "./auth.service";
import { Validation } from "../../middelwares/validation.middelware";
import {
  SignUpSchema,
  confirmEmailSchema,
  LoginSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
  OAuthSchema,
  VerifyOtpSchema,
} from "./auth.validation";

const router: Router = Router();

router.post("/signup", Validation(SignUpSchema), authService.signup);

router.post("/oauth", Validation(OAuthSchema), authService.oauthLogin);

router.post(
  "/confirmEmail",
  Validation(confirmEmailSchema),
  authService.confirmEmail
);

router.post("/login", Validation(LoginSchema), authService.login);

router.post(
  "/forget-password",
  Validation(ForgetPasswordSchema),
  authService.forgetPassword
);

router.post(
  "/verify-forgot-otp",
  Validation(VerifyOtpSchema),
  authService.verifyForgotOtp
);

router.patch(
  "/reset-password",
  Validation(ResetPasswordSchema),
  authService.ResetPassword
);

export default router;
