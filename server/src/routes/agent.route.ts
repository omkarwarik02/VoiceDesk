import { Router } from "express";
import { askAgentHandler } from "../controllers/agentController.js";

export const agentRouter = Router();

agentRouter.post("/", askAgentHandler);