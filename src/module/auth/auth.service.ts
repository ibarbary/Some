import type { Request, Response, NextFunction } from "express";
import { userRepository } from "../../DB/repositories/user.repositiories";
import { UserModel_pending } from "../../DB/model/user.pending.model";
import {
  SignupDto,
  ConfirmEmailDto,
  loginDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from "./auth.dto";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/errors/error.response";
import { compareText, hashtext } from "../../utils/security/hash";
import {
  sendConfirmEmail,
  sendForgotPasswordEmail,
} from "../../utils/email/email.event";
import { generateOtp } from "../../utils/generateotp/generateotp";
import { UserModel } from "../../DB/model/user.model";
import { createLoginCredentials } from "../../utils/token/token";
class AuthenticationService {
  private UserModel_pending = new userRepository(UserModel_pending);
  private _UserModel = new userRepository(UserModel);

  constructor() {}

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { name, username, email, password, role, birthdate }: SignupDto =
      req.body;

    const checkuser = await this.UserModel_pending.findone({
      filter: { email },
    });
    if (checkuser) {
      throw new BadRequestException("user already exist");
    }
    const otp = generateOtp();

    const user =
      (await this.UserModel_pending.createUser({
        data: [
          {
            name,
            username,
            email,
            password: await hashtext(password),
            role,
            confirmEmailOtp: await hashtext(String(otp)),
            birthdate,
          },
        ],
        options: { validateBeforeSave: true },
      })) || [];

    if (!user) {
      throw new BadRequestException("user not created");
    }

    await sendConfirmEmail({ to: email, username, otp });

    return res.status(201).json({ message: "user created suuccess", user });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { otp, email }: ConfirmEmailDto = req.body;

    const pending_user = await this.UserModel_pending.findone({
      filter: { email },
    });
    if (!pending_user) {
      throw new NotFoundException("user not found");
    }
    if (!compareText(otp, pending_user.confirmEmailOtp)) {
      throw new BadRequestException("otp is not valid");
    }

    const user = await this._UserModel.createUser({
      data: [
        {
          name: pending_user.name,
          username: pending_user.username,
          email: pending_user.email,
          password: pending_user.password,
          role: pending_user.role,
          birthdate: pending_user.birthdate,
        },
      ],
    });

    await this.UserModel_pending.deleteOne({ filter: { email } });

    const Credentials = await createLoginCredentials(user);

    return res
      .status(200)
      .json({ message: "user loged in success", Credentials });
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password }: loginDto = req.body;

    const user = await this._UserModel.findone({ filter: { email } });
    if (!user) {
      throw new NotFoundException("user not found");
    }

    if (!(await compareText(password, user.password))) {
      throw new BadRequestException("password is not valid");
    }

    const Credentials = await createLoginCredentials(user);

    return res
      .status(200)
      .json({ message: "user loged in success", Credentials });
  };

  forgetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email }: ForgetPasswordDto = req.body;

    const user = await this._UserModel.findone({ filter: { email } });
    if (!user) {
      throw new NotFoundException("user not found");
    }

    const otp = generateOtp();

    await this._UserModel.updateOne({
      filter: { email },
      update: { forgetPasswordOtp: await hashtext(String(otp)) },
    });

    await sendForgotPasswordEmail({
      to: email,
      username: user.username,
      otp,
    });

    return res.status(200).json({ message: "otp sent Success" });
  };

  ResetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, otp, confirmPassword }: ResetPasswordDto =
      req.body;

    const user = await this._UserModel.findone({ filter: { email } });
    if (!user) {
      throw new NotFoundException("user not found");
    }

    if (!(await compareText(otp, user.forgetPasswordOtp))) {
      throw new BadRequestException("otp is invalid");
    }
    if (password !== confirmPassword) {
      throw new BadRequestException(
        "password and confirmPassword must be same"
      );
    }

    await this._UserModel.updateOne({
      filter: { email },
      update: {
        password: await hashtext(password),
        $unset: { forgetPasswordOtp: 1 },
      },
    });

    return res.status(200).json({ message: "password reset Success" });
  };
}

export default new AuthenticationService();
