import type { Request, Response } from "express";
import { LogoutDto, SignupForChildDto } from "./user.dto";
 import { userRepository } from "../../DB/repositories/user.repositiories";
 import { HUserDocument, IUser, RoleEnum, UserModel } from "../../DB/model/user.model";
import { BadRequestException } from "../../utils/errors/error.response";
import { createLoginCredentials, LogoutEnum, revokeToken } from "../../utils/token/token";
import { UpdateQuery } from "mongoose";
import {  JwtPayload } from "jsonwebtoken";

class UserService {
 
    private _UserModel = new userRepository(UserModel)
    
  constructor() {}

 

 getProfile = async (req: Request, res: Response):Promise<Response> => {


return res.status(200).json({message:"profile",user:req.user,decoded:req.decoded});



  };




   signupForChild = async (req: Request, res: Response):Promise<Response> => {

 const { name, username, email, password ,  birthdate }: SignupForChildDto = req.body;


      const checkuser = await this._UserModel.findone({
        filter: { email },
      });

      if (checkuser) {
      throw new BadRequestException("user already exist with this email");
      }
      if (!req.user) {
  throw new BadRequestException("Parent user not found");
}
const user = await this._UserModel.createUser({
  data:[{name,username,email,password,birthdate,role:RoleEnum.Child,parentId:req.user._id }],
  options: { validateBeforeSave: true },
})

const credentials = await createLoginCredentials(user);


return res.status(201).json({message:"child Created Successfully",credentials});



  };

 



   Logout = async (req: Request, res: Response):Promise<Response> => {

const {flag} : LogoutDto = req.body ; 

let statusCode =200
const update : UpdateQuery<IUser> ={}
switch (flag) {
  case LogoutEnum.ALL:
    update.changeCredentialsTime = new Date() 
    break;
case LogoutEnum.ONLY:
await revokeToken(req.decoded as JwtPayload)
statusCode =201 ;
 break;

  default:
    break;
}

await this._UserModel.updateOne({filter:{_id:req.decoded?._id},update})


return res.status(statusCode).json({message:"done"});



  };
  




 refreshtoken = async (req: Request, res: Response):Promise<Response> => {
const credentials = await createLoginCredentials(req.user as HUserDocument)
await revokeToken(req.decoded as JwtPayload)
return res.status(200).json({message:"new Credentials",credentials});



  };








}


export default new UserService();
