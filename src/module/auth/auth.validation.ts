import z from "zod";
import { RoleEnum } from "../../DB/model/user.model";
import { generalFields } from "../../middelwares/validation.middelware";

export const SignUpSchema = {
  body: z.strictObject({
    name: generalFields.name,
    username: generalFields.username,
    email: generalFields.email,
    password: generalFields.password,
    role: z.enum(RoleEnum).default(RoleEnum.User),
    birthdate: z.coerce.date(),
  }),
};

export const OAuthSchema = {
  body: z.strictObject({
    provider: z.enum(["google", "facebook", "local"]),
    token: z.string().nonempty("token is required"),
    role: z.enum(RoleEnum).default(RoleEnum.User),
  }),
};

export const LoginSchema = {
  body: z.strictObject({
    email: generalFields.email,
    password: generalFields.password,
  }),
};

export const confirmEmailSchema = {
  body: z.strictObject({
    email: generalFields.email,
    otp: z.string().regex(/^\d{6}$/, { message: "OTP must be 6 numbers" }),
  }),
};

export const ForgetPasswordSchema = {
  body: z.strictObject({
    email: generalFields.email,
  }),
};

export const VerifyOtpSchema = {
  body: z.strictObject({
    email: generalFields.email,
    otp: z.string().regex(/^\d{6}$/, { message: "OTP must be 6 digits" }),
  }),
};

export const ResetPasswordSchema = {
  body: z
    .strictObject({
      password: generalFields.password,
      confirmPassword: generalFields.confirmPassword,
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "password and confirmPassword must be same",
          path: ["confirmPassword"],
        });
      }
    }),
};
