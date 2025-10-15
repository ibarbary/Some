import { compare, hash } from "bcrypt"



export const hashtext = async (plainText:string,saltround:number = Number(process.env.SALT as string)):Promise<string>=>
    {

return await hash(plainText,saltround)

    }



    
    export const compareText = async (plainText:string,hashedText:string):Promise<boolean>=>
    {

return await compare(plainText,hashedText);

    }
    