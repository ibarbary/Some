import { RoleEnum } from "../../DB/model/user.model";

export const endpoints = {
  getStages: [RoleEnum.User, RoleEnum.Child],
  startStage: [RoleEnum.User, RoleEnum.Child],
  getLevelProgress: [RoleEnum.User, RoleEnum.Child],
};
