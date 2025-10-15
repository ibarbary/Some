import { Model,CreateOptions, HydratedDocument } from "mongoose";
import { DatabaseRepository } from "./databas.repositories";
import { IUser } from "../model/user.model";
import { BadRequestException } from "../../utils/errors/error.response";





export class userRepository extends DatabaseRepository <IUser> {
constructor(protected override readonly model:Model<IUser>)
{
    super (model);
}



 async createUser({
    data,
    options,
  }: {
    data: Partial<IUser>[];
    options?: CreateOptions ;
  }): Promise<HydratedDocument<IUser>> {
const [user] = await this.create({data,options}) || [];
if(!user){
    throw new BadRequestException('user not created') ;
}    
return user

  }








}

