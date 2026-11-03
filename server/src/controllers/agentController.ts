import type { Request, Response } from "express";
import { z } from "zod";
import { askAgent } from "../services/agentService.js";
import { AgentMessageInput } from "../validation/agent.schema.js";

export async function askAgentHandler(req:Request, res:Response){
    const parsed = AgentMessageInput.safeParse(req.body);
    if(!parsed.success){
         res.status(400).json({ ok: false, error: z.prettifyError(parsed.error) });
     return;
    }

    const result = await askAgent(parsed.data.message,parsed.data.threadId);

    res.status(200).json({ ok: true, ...result });

    
}
