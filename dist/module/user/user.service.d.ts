import type { Request, Response } from "express";
declare class UserService {
    private _UserModel;
    private _StageModel;
    private _LearnerStageProgressModel;
    getMe: (req: Request, res: Response) => Promise<Response>;
    updateMe: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map