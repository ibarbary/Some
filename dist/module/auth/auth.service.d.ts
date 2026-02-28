import type { Request, Response } from "express";
declare class AuthenticationService {
    private UserModel_pending;
    private _UserModel;
    constructor();
    oauthLogin: (req: Request, res: Response) => Promise<Response>;
    signup: (req: Request, res: Response) => Promise<Response>;
    confirmEmail: (req: Request, res: Response) => Promise<Response>;
    login: (req: Request, res: Response) => Promise<Response>;
    forgetPassword: (req: Request, res: Response) => Promise<Response>;
    verifyForgotOtp: (req: Request, res: Response) => Promise<Response>;
    ResetPassword: (req: Request, res: Response) => Promise<Response>;
    Logout: (req: Request, res: Response) => Promise<Response>;
    refreshtoken: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: AuthenticationService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map