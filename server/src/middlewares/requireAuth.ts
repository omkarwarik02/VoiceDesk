import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction} from "express";
import { HttpError } from "../utils/httpError.js";

export function requireAuth(req:Request, _res:Response,next:NextFunction) {
    const {userId} = getAuth(req);

    if(!userId){
         if (!userId) {
    throw new HttpError(401, "Please sign in to use VoiceDesk.");
  }
    }
    next();

}