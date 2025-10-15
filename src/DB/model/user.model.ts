import mongoose,{models, Types, HydratedDocument} from "mongoose";


export enum RoleEnum {
    User = "User",
    Guardian = " Guardian",
    Child    = "Child" ,
}
export interface IUser {
_id : Types.ObjectId ,
name : string , 
username : string , 
email : string , 
password : string , 
createdAt: Date , 
updatedAt: Date ,
confirmEmailOtp : string , 
forgetPasswordOtp : string,
changeCredentialsTime:Date
birthdate : Date
role: RoleEnum
parentId?: Types.ObjectId
}


export const userSchema = new mongoose.Schema<IUser>({
name : {type : String , required : true} ,
username : {type : String , unique : true,required : true} ,
email : {type : String , unique : true,required : true} ,
password : {type : String , required : true,min:8} ,
confirmEmailOtp : {type : String , min:6} ,
changeCredentialsTime:Date,
forgetPasswordOtp : {type : String,min:6} ,
birthdate : {type : Date , required : true},
role:{type:String , enum:Object.values(RoleEnum) , default : RoleEnum.User},
parentId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:false}

},
{timestamps : true}

)



export const UserModel = models.User || mongoose.model<IUser>("User",userSchema)
export type HUserDocument = HydratedDocument<IUser> 
 