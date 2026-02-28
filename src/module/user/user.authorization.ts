import { RoleEnum } from "../../DB/model/user.model";

export const endpoints = {
  profile: [RoleEnum.Child, RoleEnum.Guardian, RoleEnum.User],
  SignupForChild: [RoleEnum.Guardian],
  delete: [RoleEnum.Child, RoleEnum.Guardian, RoleEnum.User],
  update: [RoleEnum.Child, RoleEnum.Guardian, RoleEnum.User],
};
