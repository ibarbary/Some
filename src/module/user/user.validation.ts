import z from "zod"
import { generalFields } from "../../middelwares/validation.middelware"
import { LogoutEnum } from "../../utils/token/token"



export const SignUpForChildSchema ={
body:z.strictObject({
   name:generalFields.name,
   username:generalFields.username, 
   email:generalFields.email,
   password:generalFields.password,
   birthdate:z.coerce.date()
})

}






export const logoutSchema ={
body:z.strictObject({
   
  flag : z.enum(LogoutEnum).default(LogoutEnum.ALL)

   
})

}
