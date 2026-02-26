import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../../DB/repositories/user.repositiories";
import { UserModel_pending } from "../../DB/model/user.pending.model";
import { HUserDocument, UserModel } from "../../DB/model/user.model";
import { OAuth2Client } from "google-auth-library";
import { JwtPayload } from "jsonwebtoken";
import axios from "axios";
import {
  SignupDto,
  ConfirmEmailDto,
  loginDto,
  ForgetPasswordDto,
  ResetPasswordDto,
  OAuthDto,
} from "./auth.dto";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../../utils/errors/error.response";
import { compareText, hashtext } from "../../utils/security/hash";
import {
  sendConfirmEmail,
  sendForgotPasswordEmail,
} from "../../utils/email/email.event";
import { generateOtp } from "../../utils/generateotp/generateotp";
import { createLoginCredentials, revokeToken } from "../../utils/token/token";
import generateUsername from "../../utils/generateUsername";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthenticationService {
  private UserModel_pending = new userRepository(UserModel_pending);
  private _UserModel = new userRepository(UserModel);

  constructor() {}

  oauthLogin = async (req: Request, res: Response): Promise<Response> => {
    const { provider, token, role }: OAuthDto = req.body;

    let userData: {
      email: string;
      name: string;
      providerId: string;
      profileImage?: string;
    };

    if (provider === "google") {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new BadRequestException("Invalid Google token");
      }

      userData = {
        email: payload.email,
        name: payload.name!,
        providerId: payload.sub,
        profileImage: payload.picture!,
      };
    } else if (provider === "facebook") {
      const fbRes = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`,
      );

      const data = fbRes.data;
      if (!data.email) {
        throw new BadRequestException("Invalid Facebook token");
      }

      userData = {
        email: data.email,
        name: data.name,
        providerId: data.id,
        profileImage: data.picture?.data?.url,
      };
    } else {
      throw new BadRequestException("Invalid provider");
    }

    let user = await this._UserModel.findone({
      filter: { email: userData.email },
    });

    if (!user) {
      user = await this._UserModel.createUser({
        data: [
          {
            name: userData.name,
            username: generateUsername(userData.name, userData.email),
            email: userData.email,
            provider,
            providerId: userData.providerId,
            profileImage: userData.profileImage!,
            role,
          },
        ],
      });
    }

    const Credentials = await createLoginCredentials(user);
    return res.status(200).json({ message: "Login success", Credentials });
  };

  signup = async (req: Request, res: Response): Promise<Response> => {
    const { name, username, email, password, role, birthdate }: SignupDto =
      req.body;

    const existingUser = await this._UserModel.findone({
      filter: { email },
    });

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    await this.UserModel_pending.deleteOne({ filter: { email } });

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

    return res.status(201).json({
      message: "Signup successful. A confirmation email has been sent.",
    });
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

    return res.status(200).json({
      message: "user logged in successfully",
      Credentials,
    });
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
      .json({ message: "user logged in successfully", Credentials });
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
      update: {
        forgetPasswordOtp: await hashtext(String(otp)),
        forgetPasswordOtpExpires: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendForgotPasswordEmail({
      to: email,
      username: user.username,
      otp,
    });

    return res.status(200).json({ message: "otp sent successfully" });
  };

  verifyForgotOtp = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp } = req.body;

    const user = await this._UserModel.findone({ filter: { email } });
    if (!user) {
      throw new NotFoundException("user not found");
    }

    if (!user.forgetPasswordOtp || !user.forgetPasswordOtpExpires) {
      throw new BadRequestException("no OTP found or expired");
    }

    if (new Date() > new Date(user.forgetPasswordOtpExpires)) {
      await this._UserModel.updateOne({
        filter: { email },
        update: {
          $unset: { forgetPasswordOtp: 1, forgetPasswordOtpExpires: 1 },
        },
      });
      throw new BadRequestException("OTP expired");
    }

    const isMatch = await compareText(otp, user.forgetPasswordOtp);
    if (!isMatch) {
      throw new BadRequestException("invalid OTP");
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "5m",
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      resetToken,
    });
  };

  ResetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { password, confirmPassword }: ResetPasswordDto = req.body;

    const resetToken = req.headers.authorization?.split(" ")[1];

    if (!resetToken) {
      throw new UnauthorizedException("Missing reset token");
    }

    let decoded: { email: string };

    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET!) as {
        email: string;
      };
    } catch {
      throw new UnauthorizedException("Invalid or expired reset token");
    }

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const user = await this._UserModel.findone({
      filter: { email: decoded.email },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this._UserModel.updateOne({
      filter: { email: decoded.email },
      update: {
        password: await hashtext(password),
        $unset: { forgetPasswordOtp: 1, forgetPasswordOtpExpires: 1 },
      },
    });

    return res.status(200).json({ message: "Password reset successfully" });
  };

  Logout = async (req: Request, res: Response): Promise<Response> => {
    if (!req.decoded) {
      throw new UnauthorizedException("No active session found");
    }

    await revokeToken(req.decoded as JwtPayload);

    return res.status(200).json({ message: "Logged out successfully" });
  };

  refreshtoken = async (req: Request, res: Response): Promise<Response> => {
    const credentials = await createLoginCredentials(req.user as HUserDocument);
    await revokeToken(req.decoded as JwtPayload);
    return res.status(200).json({ message: "new Credentials", credentials });
  };
}

export default new AuthenticationService();
