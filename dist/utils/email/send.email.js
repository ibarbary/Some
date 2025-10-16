"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = require("nodemailer");
const error_response_1 = require("../errors/error.response");
const sendEmail = async (data) => {
    if (!data.text && !data.html && !data.attachments?.length) {
        throw new error_response_1.BadRequestException("missing email content");
    }
    const transporter = (0, nodemailer_1.createTransport)({
        service: "gmail",
        auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
    });
    return await transporter.sendMail({ ...data, from: `"hello from lexy"  <${process.env.EMAIL}>`, });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=send.email.js.map