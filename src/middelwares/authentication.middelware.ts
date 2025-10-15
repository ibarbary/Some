
import { NextFunction,Request,Response } from "express";
import { BadRequestException } from "../utils/errors/error.response";
import { decodedtoken, TokenEnum } from "../utils/token/token";
import { RoleEnum } from "../DB/model/user.model";


export const authentication = (accessRole:RoleEnum[] = [],  tokenType:TokenEnum = TokenEnum.Access) => {
return async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){

        throw new BadRequestException("missing token in headers") ;   }

const {decoded,user} = await decodedtoken({authorization:req.headers.authorization,tokenType});

if(!accessRole.includes(user.role)){
    throw new BadRequestException("user not authorized");
}
// beare token

req.user = user;
req.decoded = decoded;
next(); 


};





}