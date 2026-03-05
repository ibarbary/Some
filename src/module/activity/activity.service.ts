import type { Request, Response } from "express";
import { ActivityQueryDto } from "./activity.dto";
import { ActivityLogModel } from "../../DB/model/activityLog.model";
import { ActivityLogRepository } from "../../DB/repositories/activityLog.repository";
import { UserModel } from "../../DB/model/user.model";
import { userRepository } from "../../DB/repositories/user.repositiories";

class ActivityService {
  private _ActivityLogModel = new ActivityLogRepository(ActivityLogModel);
  private _UserModel = new userRepository(UserModel);

  getParentActivity = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { limit } = req.query as unknown as ActivityQueryDto;
    const parentId = req.user!._id;

    const filter: Record<string, any> = { parent_id: parentId };

    const logs = await this._ActivityLogModel.find({
      filter,
      options: {
        sort: { created_at: -1 },
        limit,
        populate: [
          {
            path: "learner_id",
            select: "name profileImage",
          },
        ],
      },
    });

    const formatted = logs.map((log: any) => ({
      _id: log._id,
      type: log.type,
      description: log.description,
      metadata: log.metadata ?? null,
      created_at: log.created_at,
      learner: log.learner_id
        ? {
            _id: log.learner_id._id,
            name: log.learner_id.name,
            profileImage: log.learner_id.profileImage ?? null,
          }
        : null,
    }));

    return res.status(200).json({
      message: "Activity fetched successfully",
      data: formatted,
    });
  };

  getLearnerActivity = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { limit } = req.query as unknown as ActivityQueryDto;
    const learnerId = req.user!._id;

    const filter: Record<string, any> = { learner_id: learnerId };

    const logs = await this._ActivityLogModel.find({
      filter,
      options: {
        sort: { created_at: -1 },
        limit,
      },
    });

    const formatted = logs.map((log: any) => ({
      _id: log._id,
      type: log.type,
      description: log.description,
      metadata: log.metadata ?? null,
      created_at: log.created_at,
    }));

    return res.status(200).json({
      message: "Activity fetched successfully",
      data: formatted,
    });
  };
}

export default new ActivityService();
