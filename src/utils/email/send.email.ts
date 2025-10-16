import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Transporter } from "nodemailer";
import { BadRequestException } from "../errors/error.response";

export const sendEmail = async (data: Mail.Options) => {
  if (!data.text && !data.html && !data.attachments?.length) {
    throw new BadRequestException("missing email content");
  }

  const transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  > = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_LOGIN,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });

  return await transporter.sendMail({
    ...data,
    from: `"Lexy App"  <${process.env.EMAIL}>`,
  });
};
