import type { Request, Response } from "express";
declare class UserService {
    private _UserModel;
    constructor();
    getProfile: (req: Request, res: Response) => Promise<Response>;
    signupForChild: (req: Request, res: Response) => Promise<Response>;
    Logout: (req: Request, res: Response) => Promise<Response>;
    refreshtoken: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map