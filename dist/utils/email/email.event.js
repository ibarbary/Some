"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPasswordEmail = exports.sendConfirmEmail = void 0;
const email_tempelate_1 = require("./email.tempelate");
const send_email_1 = require("./send.email");
const sendConfirmEmail = async (data) => {
    try {
        data.subject = "Confirm Your Email";
        data.html = (0, email_tempelate_1.emailVerificationTemplate)(data.otp, data.username);
        await (0, send_email_1.sendEmail)(data);
        console.log("✅ Confirmation email sent successfully");
    }
    catch (error) {
        console.error("❌ Failed to send confirmation email", error);
        throw error;
    }
};
exports.sendConfirmEmail = sendConfirmEmail;
const sendForgotPasswordEmail = async (data) => {
    try {
        data.subject = "Forgot Password";
        data.html = (0, email_tempelate_1.forgetPasswordTemplate)(data.otp, data.username);
        await (0, send_email_1.sendEmail)(data);
        console.log("✅ Password reset email sent successfully");
    }
    catch (error) {
        console.error("❌ Failed to send password reset email", error);
        throw error;
    }
};
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
//# sourceMappingURL=email.event.js.map