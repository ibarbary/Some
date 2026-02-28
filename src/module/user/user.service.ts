import type { Request, Response } from "express";
import { userRepository } from "../../DB/repositories/user.repositiories";
import { RoleEnum, UserModel } from "../../DB/model/user.model";
import { BadRequestException } from "../../utils/errors/error.response";

class UserService {
  private _UserModel = new userRepository(UserModel);

  constructor() {}

  getProfile = async (req: Request, res: Response): Promise<Response> => {
    return res
      .status(200)
      .json({ message: "profile", user: req.user, decoded: req.decoded });
  };
}

export default new UserService();
