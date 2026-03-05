import { RoleEnum } from "../../DB/model/user.model";

export const endpoints = {
  startSession: [RoleEnum.User, RoleEnum.Child],
  heartbeat: [RoleEnum.User, RoleEnum.Child],
  endSession: [RoleEnum.User, RoleEnum.Child],
};
