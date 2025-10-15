
import { RoleEnum } from "../../DB/model/user.model"



export const endpoints = {
profile : [RoleEnum.Child,RoleEnum.Guardian,RoleEnum.User],
SignupForChild : [RoleEnum.Guardian],
logout : [RoleEnum.Child,RoleEnum.Guardian,RoleEnum.User]
,refrehToken : [RoleEnum.Child,RoleEnum.Guardian,RoleEnum.User],

}