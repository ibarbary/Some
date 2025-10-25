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
import { authentication } from "../../middelwares/authentication.middelware";
import { TokenEnum } from "../../utils/token/token";
import { endpoints } from "./auth.authorization";

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

router.post("/logout", authentication(endpoints.logout), authService.Logout);

router.post(
  "/refresh-token",
  authentication(endpoints.refreshToken, TokenEnum.Refresh),
  authService.refreshtoken
);

export default router;
