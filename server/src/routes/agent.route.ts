import { Router } from "express";
import { askAgentHandler, resumeAgentHandler } from "../controllers/agentController.js";
import { resumeAgent } from "../services/agentService.js";
import {  uploadAudio } from "../middlewares/upload.js";
import { voiceHandler } from "../controllers/voiceController.js";

export const agentRouter = Router();

agentRouter.post("/", askAgentHandler);
agentRouter.post("/resume",resumeAgentHandler );
agentRouter.post("/voice", uploadAudio, voiceHandler)