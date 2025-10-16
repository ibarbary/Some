import Mail from "nodemailer/lib/mailer"
import EventEmitter from "events"
import { forgetPasswordTemplate,  emailVerificationTemplate } from "./email.tempelate"
import { sendEmail } from "./send.email"

export const emailEvent = new EventEmitter() 
interface IEmail extends Mail.Options {
otp : number ,
username : string

}


emailEvent.on("confirmEmail", async(data:IEmail)=>{
    try {
    data.subject ="Confirm Your Email"
data.html = emailVerificationTemplate(data.otp,data.username)
await sendEmail(data)
    
    } catch (error) {
        console.log("failed to send email",error)
    }

})



emailEvent.on("forgotPassword", async(data:IEmail)=>{
    try {
    data.subject ="Forgot Password"
data.html = forgetPasswordTemplate(data.otp,data.username)
await sendEmail(data)
    
    } catch (error) {
        console.log("failed to send email",error)
    }

})