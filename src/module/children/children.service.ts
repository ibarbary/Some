import type { Request, Response } from "express";
import { CreateChildDto, UpdateChildDto } from "./children.dto";
import { userRepository } from "../../DB/repositories/user.repositiories";
import { RoleEnum, UserModel, HUserDocument } from "../../DB/model/user.model";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/errors/error.response";
import { Types } from "mongoose";

class ChildrenService {
  private _UserModel = new userRepository(UserModel);

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

    await this._UserModel.createUser({
      data: [
        {
          name,
          username,
          email,
          password,
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

    console.log("Got children");

    return res.status(200).json({
      message: "Children fetched successfully",
      children,
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
    const { name, username, birthdate }: UpdateChildDto = req.body;

    await this._verifyChildOwnership(req.params.childId!, req.user!._id);

    if (username) {
      const taken = await this._UserModel.findone({
        filter: { username },
      });
      if (taken) {
        throw new BadRequestException("Username is already taken");
      }
    }

    const updated = await this._UserModel.findOneAndUpdate({
      filter: { _id: req.params.childId },
      update: { name, username, birthdate },
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
