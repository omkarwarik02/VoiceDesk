import { z } from "zod";

export const AgentMessageInput = z.object({
    message: z.string().trim().min(1,"message").max(500,"message.."),
    threadId:z.uuid().optional()
});

export type AgentMessageInput = z.infer<typeof AgentMessageInput>