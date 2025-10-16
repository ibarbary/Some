"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = require("nodemailer");
const error_response_1 = require("../errors/error.response");
const sendEmail = async (data) => {
    if (!data.text && !data.html && !data.attachments?.length) {
        throw new error_response_1.BadRequestException("missing email content");
    }
    //   const transporter: Transporter<
    //     SMTPTransport.SentMessageInfo,
    //     SMTPTransport.Options
    //   > = createTransport({
    //     host: "smtp-relay.brevo.com",
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: process.env.BREVO_SMTP_LOGIN,
    //       pass: process.env.BREVO_SMTP_KEY,
    //     },
    //   });
    const transporter = (0, nodemailer_1.createTransport)({
        service: "gmail",
        auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
    });
    return await transporter.sendMail({
        ...data,
        from: `"Lexy App"  <${process.env.EMAIL}>`,
    });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=send.email.js.map