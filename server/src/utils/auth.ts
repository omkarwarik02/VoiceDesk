import { getAuth } from "@clerk/express";
import type { Request } from "express";
import { HttpError } from "./httpError.js";

export default function getUserId(req:Request){
    const { userId} = getAuth(req);
    if(!userId){
         throw new HttpError(401, "Please sign in to use VoiceDesk.");
    }
    return userId;
}