import { RoleEnum } from "../../DB/model/user.model";

export const endpoints = {
  getParentActivity: [RoleEnum.Guardian],
  getLearnerActivity: [RoleEnum.User, RoleEnum.Child],
};
