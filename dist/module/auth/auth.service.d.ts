import type { Request, Response, NextFunction } from "express";
declare class AuthenticationService {
    private UserModel_pending;
    private _UserModel;
    constructor();
    signup: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    confirmEmail: (req: Request, res: Response) => Promise<Response>;
    login: (req: Request, res: Response) => Promise<Response>;
    forgetPassword: (req: Request, res: Response) => Promise<Response>;
    ResetPassword: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: AuthenticationService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map