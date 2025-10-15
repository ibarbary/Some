"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const events_1 = __importDefault(require("events"));
const email_tempelate_1 = require("./email.tempelate");
const send_email_1 = require("./send.email");
exports.emailEvent = new events_1.default();
exports.emailEvent.on("confirmEmail", async (data) => {
    try {
        data.subject = "confirma your email";
        data.html = (0, email_tempelate_1.emailVerificationTemplate)(data.otp, data.username);
        await (0, send_email_1.sendEmail)(data);
    }
    catch (error) {
        console.log("failed to send email", error);
    }
});
exports.emailEvent.on("forgotPassword", async (data) => {
    try {
        data.subject = "forgot password";
        data.html = (0, email_tempelate_1.forgetPasswordTemplate)(data.otp, data.username);
        await (0, send_email_1.sendEmail)(data);
    }
    catch (error) {
        console.log("failed to send email", error);
    }
});
//# sourceMappingURL=email.event.js.map