import type { Request, Response } from "express";
import { CreateChildDto, UpdateChildDto } from "./children.dto";
import { userRepository } from "../../DB/repositories/user.repositiories";
import { StageRepository } from "../../DB/repositories/stage.repository";
import { LearnerStageProgressRepository } from "../../DB/repositories/learnerStageProgress.repository";
import { StageModel } from "../../DB/model/stage.model";
import { LearnerStageProgressModel } from "../../DB/model/learnerStageProgress.model";
import { RoleEnum, UserModel, HUserDocument } from "../../DB/model/user.model";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/errors/error.response";
import { hashtext } from "../../utils/security/hash";
import { Types } from "mongoose";

class ChildrenService {
  private _UserModel = new userRepository(UserModel);
  private _StageModel = new StageRepository(StageModel);
  private _LearnerStageProgressModel = new LearnerStageProgressRepository(
    LearnerStageProgressModel,
  );

  createChild = async (req: Request, res: Response): Promise<Response> => {
    const { name, username, email, password, birthdate }: CreateChildDto =
      req.body;

    const existing = await this._UserModel.findone({ filter: { email } });
    if (existing) {
      throw new BadRequestException("A user already exists with this email");
    }

    const taken = await this._UserModel.findone({
      filter: { username },
    });
    if (taken) {
      throw new BadRequestException("Username is already taken");
    }

    const passwordHash = await hashtext(password);
    console.log(passwordHash);

    await this._UserModel.createUser({
      data: [
        {
          name,
          username,
          email,
          password: passwordHash,
          ...(birthdate && { birthdate }),
          role: RoleEnum.Child,
          parentId: req.user!._id,
        },
      ],
      options: { validateBeforeSave: true },
    });

    return res.status(201).json({ message: "Child created successfully" });
  };

  getChildren = async (req: Request, res: Response): Promise<Response> => {
    const children = await this._UserModel.find({
      filter: { parentId: req.user!._id },
    });

    const enriched = await Promise.all(
      children.map(async (child: any) => {
        const stageProgressRecords = await this._LearnerStageProgressModel.find(
          {
            filter: { learner_id: child._id },
          },
        );

        if (!stageProgressRecords.length) {
          return { ...child.toObject(), stages: [] };
        }

        const stageIds = stageProgressRecords.map((sp: any) => sp.stage_id);
        const stages = await this._StageModel.find({
          filter: { _id: { $in: stageIds } },
          options: { sort: { order_index: 1 } },
        });

        const stageMap = new Map(
          stageProgressRecords.map((sp: any) => [sp.stage_id.toString(), sp]),
        );

        const stagesWithProgress = stages.map((stage: any) => {
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

        return { ...child.toObject(), stages: stagesWithProgress };
      }),
    );

    return res.status(200).json({
      message: "Children fetched successfully",
      children: enriched,
    });
  };

  getChild = async (req: Request, res: Response): Promise<Response> => {
    const child = await this._verifyChildOwnership(
      req.params.childId!,
      req.user!._id,
    );

    return res.status(200).json({
      message: "Child fetched successfully",
      child,
    });
  };

  updateChild = async (req: Request, res: Response): Promise<Response> => {
    const { name, username, birthdate, profileImage }: UpdateChildDto =
      req.body;

    await this._verifyChildOwnership(req.params.childId!, req.user!._id);

    if (username) {
      const taken = await this._UserModel.findone({ filter: { username } });

      if (taken && taken._id.toString() !== req.params.childId) {
        throw new BadRequestException("Username is already taken");
      }
    }

    const updated = await this._UserModel.findOneAndUpdate({
      filter: { _id: req.params.childId },
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

    return res.status(200).json({
      message: "Child updated successfully",
      child: updated,
    });
  };

  deleteChild = async (req: Request, res: Response): Promise<Response> => {
    await this._verifyChildOwnership(req.params.childId!, req.user!._id);

    await this._UserModel.deleteOne({ filter: { _id: req.params.childId } });

    return res.status(200).json({ message: "Child deleted successfully" });
  };

  private _verifyChildOwnership = async (
    childId: string,
    guardianId: Types.ObjectId,
  ): Promise<HUserDocument> => {
    const child = await this._UserModel.findone({
      filter: { _id: childId, role: RoleEnum.Child },
    });

    if (!child) {
      throw new NotFoundException("Child not found");
    }

    if (!child.parentId?.equals(guardianId)) {
      throw new BadRequestException(
        "You are not authorized to manage this child",
      );
    }

    return child;
  };
}

export default new ChildrenService();
