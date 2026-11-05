import type { Request, Response } from "express";
import { AgentMessageInput } from "../validation/agent.schema.js";
import { z } from "zod"
import { transcribe } from "../services/transcribeService.js";
import { askAgent } from "../services/agentService.js";

export async function voiceHandler(req:Request, res:Response){
    if(!req.file){
        return res.status(400).json({ ok: false, error: "No audio file. Send it in a form field named 'audio'." });
    }
    const parsed = AgentMessageInput.pick({ threadId: true}).safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({ ok:false, error:z.prettifyError(parsed.error)})
    }
    const transcript = await transcribe(req.file.buffer, req.file.originalname);
    console.log(transcript);
    if(!transcript){
        return res.status(400).json({ ok:false, error:"Couldn't hear anything. Please try again."});
    }

    const result = await askAgent(transcript, parsed.data.threadId);
     return res.json({ ok: true, transcript, ...result });
}