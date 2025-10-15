import { Router } from "express";
import authService from "./auth.service";
import { Validation } from "../../middelwares/validation.middelware";
import { SignUpSchema, confirmEmailSchema,LoginSchema,ForgetPasswordSchema,ResetPasswordSchema } from "./auth.validation";

const router:Router = Router();

router.post('/signup',Validation(SignUpSchema),authService.signup)
router.post('/confirmEmail',Validation(confirmEmailSchema),authService.confirmEmail)
router.post('/login',Validation(LoginSchema),authService.login)

router.patch('/forget-password',Validation(ForgetPasswordSchema),authService.forgetPassword)


router.patch('/reset-password',Validation(ResetPasswordSchema),authService.ResetPassword)


export default router