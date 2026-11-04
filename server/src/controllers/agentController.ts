import type { Request, Response } from "express";
import { z } from "zod";
import { askAgent, resumeAgent } from "../services/agentService.js";
import { AgentMessageInput, ResumeAgentInput } from "../validation/agent.schema.js";

export async function askAgentHandler(req:Request, res:Response){
    const parsed = AgentMessageInput.safeParse(req.body);
    if(!parsed.success){
         res.status(400).json({ ok: false, error: z.prettifyError(parsed.error) });
     return;
    }

    const result = await askAgent(parsed.data.message,parsed.data.threadId);

    res.status(200).json({ ok: true, ...result });

    
}

export async function resumeAgentHandler(req:Request, res:Response){
    const parsed = ResumeAgentInput.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({ ok:false, error:z.prettifyError(parsed.error)});
    }
    const result = await resumeAgent(parsed.data.threadId,parsed.data.decision);

    if(result.status === "nothing_to_resume" ){
        return res.status(409).json({ok:false, error:"Nothing is waiting for approval in this conversation"})
    }
    res.status(200).json({ok:true,...result })
}
