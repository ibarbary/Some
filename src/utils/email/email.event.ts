import Mail from "nodemailer/lib/mailer";
import {
  forgetPasswordTemplate,
  emailVerificationTemplate,
} from "./email.tempelate";
import { sendEmail } from "./send.email";

interface IEmail extends Mail.Options {
  otp: number;
  username: string;
}

export const sendConfirmEmail = async (data: IEmail) => {
  try {
    data.subject = "Confirm Your Email";
    data.html = emailVerificationTemplate(data.otp, data.username);
    await sendEmail(data);
    console.log("✅ Confirmation email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send confirmation email", error);
    throw error;
  }
};

export const sendForgotPasswordEmail = async (data: IEmail) => {
  try {
    data.subject = "Forgot Password";
    data.html = forgetPasswordTemplate(data.otp, data.username);
    await sendEmail(data);
    console.log("✅ Password reset email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send password reset email", error);
    throw error;
  }
};