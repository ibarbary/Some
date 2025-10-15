import { Router } from "express";
import { authentication } from "../../middelwares/authentication.middelware";
import { endpoints } from "./user.authorization";
import userService from "./user.service";
import { Validation } from "../../middelwares/validation.middelware";
import {  logoutSchema, SignUpForChildSchema } from "./user.validation";
import { TokenEnum } from "../../utils/token/token";

const router:Router = Router();

router.get('/getprofile',authentication(endpoints.profile),userService.getProfile)

router.post('/signup-for-Child',
    Validation(SignUpForChildSchema),
authentication(endpoints.SignupForChild),
userService.signupForChild)





router.post('/logout',Validation(logoutSchema),authentication(endpoints.logout),userService.Logout)



router.post('/refresh-token',authentication(endpoints.refrehToken, TokenEnum.Refresh),userService.refreshtoken)





export default router