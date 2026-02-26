import type { Request, Response } from "express";
import {  SignupForChildDto } from "./user.dto";
import { userRepository } from "../../DB/repositories/user.repositiories";
import {
  HUserDocument,
  RoleEnum,
  UserModel,
} from "../../DB/model/user.model";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../utils/errors/error.response";
import {
  createLoginCredentials,
  revokeToken,
} from "../../utils/token/token";
import { JwtPayload } from "jsonwebtoken";

class UserService {
  private _UserModel = new userRepository(UserModel);

  constructor() {}

  getProfile = async (req: Request, res: Response): Promise<Response> => {
    return res
      .status(200)
      .json({ message: "profile", user: req.user, decoded: req.decoded });
  };

  signupForChild = async (req: Request, res: Response): Promise<Response> => {
    const { name, username, email, password, birthdate }: SignupForChildDto =
      req.body;

    const checkuser = await this._UserModel.findone({
      filter: { email },
    });

    if (checkuser) {
      throw new BadRequestException("user already exist with this email");
    }
    if (!req.user) {
      throw new BadRequestException("Parent user not found");
    }
    const user = await this._UserModel.createUser({
      data: [
        {
          name,
          username,
          email,
          password,
          birthdate,
          role: RoleEnum.Child,
          parentId: req.user._id,
        },
      ],
      options: { validateBeforeSave: true },
    });

    const credentials = await createLoginCredentials(user);

    return res
      .status(201)
      .json({ message: "child Created Successfully", credentials });
  };
}

export default new UserService();
