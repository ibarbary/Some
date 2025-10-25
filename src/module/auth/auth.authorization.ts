import { RoleEnum } from "../../DB/model/user.model";

export const endpoints = {
  logout: [RoleEnum.Child, RoleEnum.Guardian, RoleEnum.User],
  refreshToken: [RoleEnum.Child, RoleEnum.Guardian, RoleEnum.User],
};
