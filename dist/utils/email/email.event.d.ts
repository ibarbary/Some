import Mail from "nodemailer/lib/mailer";
interface IEmail extends Mail.Options {
    otp: number;
    username: string;
}
export declare const sendConfirmEmail: (data: IEmail) => Promise<void>;
export declare const sendForgotPasswordEmail: (data: IEmail) => Promise<void>;
export {};
//# sourceMappingURL=email.event.d.ts.map