import { RoleEnum } from "../../DB/model/user.model";

export const endpoints = {
  // Parent views their children's recent activity
  getParentActivity: [RoleEnum.Guardian],

  // Child views their own activity history
  getLearnerActivity: [RoleEnum.User, RoleEnum.Child],
};
