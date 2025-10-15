import { HUserDocument } from "../../DB/model/user.model";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {


    interface  Request {
    
        user?: HUserDocument ;
        decoded?: JwtPayload ;
    }
    
}
    