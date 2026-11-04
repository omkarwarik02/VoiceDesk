import { z } from "zod";
import { ResumeDecision } from "./order.schema.js";

export const AgentMessageInput = z.object({
    message: z.string().trim().min(1,"message").max(500,"message.."),
    threadId:z.uuid().optional()
});
export const ResumeAgentInput = z.object({
    threadId:z.uuid(),
    decision:ResumeDecision,
})

export type AgentMessageInput = z.infer<typeof AgentMessageInput>;
export type ResumeAgentInput = z.infer<typeof ResumeAgentInput>;