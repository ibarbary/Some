import { NextFunction, Request, Response } from "express";
import  { ZodError, ZodType } from "zod"; 
import { z } from "zod";
import { BadRequestException } from "../utils/errors/error.response";
import { RoleEnum } from "../DB/model/user.model";
type SchemaType = Partial<Record<ReqTypeKey, ZodType>>
type ReqTypeKey = keyof Request

export const Validation = (schema:SchemaType)=>{
    return (req:Request,res:Response,next:NextFunction)=>{

const ValidationError:Array<{key:ReqTypeKey ,issues : Array<{message:string,path:(string|number|symbol)[]}>}> = []; 

for (const key of Object.keys(schema) as ReqTypeKey[]) {
    if(!schema[key]) continue ;



const ValidationResult = schema[key].safeParse(req[key])

if(!ValidationResult.success){
    const error = ValidationResult.error as ZodError

    ValidationError.push({
        key,
         issues : error.issues.map((issue)=>{
            return{message : issue.message ,  path : issue.path  }
            
        })
    });
}

if(ValidationError.length>0){

    throw new BadRequestException("validation error",{cause:ValidationError})
}

}


        return next() as unknown as NextFunction;
    }
}



export const generalFields = {
username : z.string({error:"username must be string"}).min(5,{error:"username must be at least 5 characters"}),
name:z.string({error:"name must be string"}).min(3,{error:"name must be at least 3 characters"}),
email : z.email({error:"email must be valid"}),
password : z.string().min(8,{error:"password must be at least 8 characters"}),
confirmPassword : z.string().min(8,{error:"confirmPassword must be at least 8 characters"}),
role : z.enum(RoleEnum).default(RoleEnum.User)



}
