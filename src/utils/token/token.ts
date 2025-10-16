import { sign, Secret, SignOptions, JwtPayload, verify } from "jsonwebtoken";
import { HUserDocument, UserModel } from "../../DB/model/user.model";
import { RoleEnum } from "../../DB/model/user.model";
import { UnauthorizedException } from "../errors/error.response";
import { userRepository } from "../../DB/repositories/user.repositiories";
import { TokenRepository } from "../../DB/repositories/token.repository";
import { TokenModel } from "../../DB/model/token.model";
import { randomUUID } from "crypto";

export enum TokenEnum{
Access = "Access",
Refresh = "Refresh"

}

export enum SignatureLevelEnum{
User = "User",
Child = "Child",
Guardian = "Guardian"

}



export enum LogoutEnum{
  ALL = "ALL",
  ONLY = "ONLY"

}
export const generateToken = async ({
  payload,
  secret = process.env.ACCESS_USER_SIGNATURE as string,
  options = { expiresIn: Number(process.env.ACCESS_EXPIRES_IN) },
}: {
  payload: object;
  secret?: Secret;
  options?: SignOptions;
}): Promise<string> => {
  return await sign(payload, secret, options);
};


export const verifyToken = async ({
  token,
  secret = process.env.ACCESS_USER_SIGNATURE as string,
  
}: {
  token: string;
  secret?: Secret;

}): Promise<JwtPayload> => {
  return await verify(token, secret,) as JwtPayload;
};



export const getSignaturesLevel = async (role: RoleEnum) => {
  let SignatureLevel :SignatureLevelEnum = SignatureLevelEnum.User;
switch (role) {
    case RoleEnum.User:
        SignatureLevel = SignatureLevelEnum.User;
        break;
 case RoleEnum.Guardian:
        SignatureLevel = SignatureLevelEnum.Guardian;
        break;

        case RoleEnum.Child:
        SignatureLevel = SignatureLevelEnum.Child;
        break;



    default:
        break;
}
return SignatureLevel

}


export const getSignature = async(signatureLevel:SignatureLevelEnum=SignatureLevelEnum.User)=>{
let Signature : {accessSignature:string,refreshSignature:string} = { accessSignature:"",   refreshSignature:""}
switch (signatureLevel) {
    case SignatureLevelEnum.User:
        Signature.accessSignature = process.env.ACCESS_USER_SIGNATURE as string;
        Signature.refreshSignature = process.env.REFRESH_USER_SIGNATURE as string;
        break;
case SignatureLevelEnum.Guardian:
        Signature.accessSignature = process.env.ACCESS_GUARDIAN_SIGNATURE as string;
        Signature.refreshSignature = process.env.REFRESH_GUARDIAN_SIGNATURE as string;
        break;

        case SignatureLevelEnum.Child:
        Signature.accessSignature = process.env.ACCESS_CHILD_SIGNATURE as string;
        Signature.refreshSignature = process.env.REFRESH_CHILD_SIGNATURE as string;
        break;
    default:
        break;
}

return Signature ;

}
    



export const createLoginCredentials = async(user:HUserDocument)=>{
const SignatureLevel = await getSignaturesLevel(user.role); 
const Signature = await getSignature(SignatureLevel);
const jwtid = randomUUID();
const accestoken = await generateToken({
    payload:{_id:user._id},
    secret:Signature.accessSignature,
    options:{expiresIn:Number(process.env.ACCESS_EXPIRES_IN),jwtid}
});

const refreshtoken = await generateToken({
    payload:{_id:user._id},
    secret:Signature.refreshSignature,
    options:{expiresIn:Number(process.env.REFRESH_EXPIRES_IN),jwtid}
    
});


return {accestoken,refreshtoken}
}


export const decodedtoken = async({authorization,tokenType=TokenEnum.Access}:{authorization:string,tokenType?:TokenEnum})=>{
const usermodel = new userRepository(UserModel);
const [bearer,token] = authorization.split(" ");
const tokenmodel = new TokenRepository(TokenModel);

if(!bearer || !token){
    throw new UnauthorizedException("token not found");
} 
const Signature = await getSignature(bearer as SignatureLevelEnum);

const decoded = await verifyToken({token,secret:tokenType===TokenEnum.Access?Signature.accessSignature:Signature.refreshSignature});

if(!decoded?._id||!decoded?.iat){
    throw new UnauthorizedException("invalid token decoded");
}
if(await tokenmodel.findone({filter:{jti:decoded.jti}})){

    throw new UnauthorizedException("token already used");
}



const user = await usermodel.findone({filter:{_id:decoded._id}});
if(!user){
    throw new UnauthorizedException("user not found");
}


if(user?.changeCredentialsTime||0 > decoded.iat*1000){
  throw new UnauthorizedException("token expired");
}
return {user,decoded}


}


export const revokeToken = async(decoded : JwtPayload)=>{
const tokenmodel = new TokenRepository(TokenModel);
const [result] = await  tokenmodel.create({data:[{
  jti:decoded?.jti as string,
  expiresIn:(decoded?.iat as number)+ Number(process.env.REFRESH_EXPIRES_IN),
  userId:decoded?._id
}],options:{validateBeforeSave:true}})||[];


if(!result){
    throw new UnauthorizedException("failed to revoke token");
}

return result
}