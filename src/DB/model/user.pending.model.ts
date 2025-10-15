import mongoose,{models} from "mongoose";
import { IUser , RoleEnum} from "./user.model";



export const userSchema_pending = new mongoose.Schema<IUser>({
name : {type : String , required : true} ,
username : {type : String , unique : true,required : true} ,
email : {type : String , unique : true,required : true} ,
password : {type : String , required : true,min:8} ,
confirmEmailOtp : {type : String , min:6} ,
forgetPasswordOtp : {type : String,min:6} ,
birthdate : {type : Date , required : true},
role:{type:String , enum:Object.values(RoleEnum) , default : RoleEnum.User},

  createdAt: {
      type: Date,
      default: Date.now,
      expires: 60*15, 
    },


},
  
{timestamps : true}

)



export const UserModel_pending = models.User_pending || mongoose.model<IUser>("User_pending",userSchema_pending)
