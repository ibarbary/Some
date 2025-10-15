
import { Model } from "mongoose"; 
import { DatabaseRepository } from "./databas.repositories";
import { IToken } from "../model/token.model";

export class TokenRepository extends DatabaseRepository<IToken> {


    
    constructor( protected override readonly  model: Model<IToken>) {
        super(model);
    }

  




}