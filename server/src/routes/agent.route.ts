import { Router } from "express";
import { askAgentHandler, resumeAgentHandler } from "../controllers/agentController.js";
import { resumeAgent } from "../services/agentService.js";

export const agentRouter = Router();

agentRouter.post("/", askAgentHandler);
agentRouter.post("/resume",resumeAgentHandler );