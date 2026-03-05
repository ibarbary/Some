import type { Request, Response } from "express";
import { ActivityQueryDto } from "./activity.dto";
import { ActivityLogModel } from "../../DB/model/activityLog.model";
import { ActivityLogRepository } from "../../DB/repositories/activityLog.repository";
import { UserModel } from "../../DB/model/user.model";
import { userRepository } from "../../DB/repositories/user.repositiories";

class ActivityService {
  private _ActivityLogModel = new ActivityLogRepository(ActivityLogModel);
  private _UserModel = new userRepository(UserModel);

  // ─────────────────────────────────────────────────────────────
  // GET /activity/parent
  // Guardian calls this to get recent activity for ALL their children.
  // Returns latest N activities sorted by date, with the child's
  // name attached to each entry for display in the dashboard.
  // ─────────────────────────────────────────────────────────────
  getParentActivity = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { limit } = req.query as unknown as ActivityQueryDto;
    const parentId = req.user!._id;

    // Build filter — parent_id is indexed so this is fast
    const filter: Record<string, any> = { parent_id: parentId };

    // Single query — parent_id on every log means no need to fetch children first
    const logs = await this._ActivityLogModel.find({
      filter,
      options: {
        sort: { created_at: -1 },
        limit,
        populate: [
          {
            path: "learner_id",
            select: "name profileImage", // only what the dashboard needs
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

  // ─────────────────────────────────────────────────────────────
  // GET /activity/me
  // Learner (User or Child) views their own activity history.
  // Useful for the child's profile screen showing what they've done.
  // ─────────────────────────────────────────────────────────────
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
