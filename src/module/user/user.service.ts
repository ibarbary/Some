import type { Request, Response } from "express";
import { userRepository } from "../../DB/repositories/user.repositiories";
import { UserModel } from "../../DB/model/user.model";
import { StageModel } from "../../DB/model/stage.model";
import { LearnerStageProgressModel } from "../../DB/model/learnerStageProgress.model";
import { StageRepository } from "../../DB/repositories/stage.repository";
import { LearnerStageProgressRepository } from "../../DB/repositories/learnerStageProgress.repository";
import { BadRequestException } from "../../utils/errors/error.response";

class UserService {
  private _UserModel = new userRepository(UserModel);
  private _StageModel = new StageRepository(StageModel);
  private _LearnerStageProgressModel = new LearnerStageProgressRepository(
    LearnerStageProgressModel,
  );

  getMe = async (req: Request, res: Response): Promise<Response> => {
    const learnerId = req.user!._id;

    // Get all stage progress records for this user
    const stageProgressRecords = await this._LearnerStageProgressModel.find({
      filter: { learner_id: learnerId },
    });

    let stages: any[] = [];

    if (stageProgressRecords.length) {
      // Get the actual stage details for those progress records only
      const stageIds = stageProgressRecords.map((sp: any) => sp.stage_id);
      const stageDetails = await this._StageModel.find({
        filter: { _id: { $in: stageIds } },
        options: { sort: { order_index: 1 } },
      });

      // Merge stage info with progress
      const stageMap = new Map(
        stageProgressRecords.map((sp: any) => [sp.stage_id.toString(), sp]),
      );

      stages = stageDetails.map((stage: any) => {
        const progress: any = stageMap.get(stage._id.toString());
        return {
          _id: stage._id,
          name: stage.name,
          language: stage.language,
          order_index: stage.order_index,
          total_levels: stage.total_levels,
          status: progress?.status,
          completed_levels: progress?.completed_levels,
          progress: progress?.progress,
        };
      });
    }

    // remove sensitive fields before returning
    const user = req.user!.toObject();
    delete user.password;
    delete user.confirmEmailOtp;
    delete user.forgetPasswordOtp;
    delete user.forgetPasswordOtpExpires;
    delete user.changeCredentialsTime;

    return res.status(200).json({
      message: "Profile fetched successfully",
      data: { ...user, stages },
    });
  };

  updateMe = async (req: Request, res: Response): Promise<Response> => {
    const { name, username, birthdate, profileImage } = req.body;

    if (username) {
      const taken = await this._UserModel.findone({ filter: { username } });
      if (taken && taken._id.toString() !== req.user!._id.toString()) {
        throw new BadRequestException("Username is already taken");
      }
    }

    const updated = await this._UserModel.findOneAndUpdate({
      filter: { _id: req.user!._id },
      update: {
        $set: {
          ...(name && { name }),
          ...(username && { username }),
          ...(birthdate && { birthdate }),
          ...(profileImage && { profileImage }),
        },
      },
      options: { new: true },
    });

    // Fetch stages (same logic as getMe)
    const stageProgressRecords = await this._LearnerStageProgressModel.find({
      filter: { learner_id: updated._id },
    });

    let stages: any[] = [];

    if (stageProgressRecords.length) {
      const stageIds = stageProgressRecords.map((sp: any) => sp.stage_id);
      const stageDetails = await this._StageModel.find({
        filter: { _id: { $in: stageIds } },
        options: { sort: { order_index: 1 } },
      });

      const stageMap = new Map(
        stageProgressRecords.map((sp: any) => [sp.stage_id.toString(), sp]),
      );

      stages = stageDetails.map((stage: any) => {
        const progress: any = stageMap.get(stage._id.toString());
        return {
          _id: stage._id,
          name: stage.name,
          language: stage.language,
          order_index: stage.order_index,
          total_levels: stage.total_levels,
          status: progress?.status,
          completed_levels: progress?.completed_levels,
          progress: progress?.progress,
        };
      });
    }

    const user = updated.toObject();
    delete user.password;
    delete user.confirmEmailOtp;
    delete user.forgetPasswordOtp;
    delete user.forgetPasswordOtpExpires;
    delete user.changeCredentialsTime;

    return res.status(200).json({
      message: "Profile updated successfully",
      data: { ...user, stages },
    });
  };
}

export default new UserService();
