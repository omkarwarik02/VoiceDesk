import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { graph } from "../agent/agent.js";


export async function askAgent(message: string, threadId?:string) {
  const id = threadId ?? crypto.randomUUID()
  const result = await graph.invoke({ messages: [new HumanMessage(message)] },{configurable:{thread_id:id}});

const start = result.messages.findLastIndex((m)=> HumanMessage.isInstance(m));
  const toolsUsed: string[] = [] ;
  for (const msg of result.messages.slice(start + 1)) {
    if (AIMessage.isInstance(msg) && msg.tool_calls?.length) {
      for (const call of msg.tool_calls) {

         toolsUsed.push(call.name);
      }
    }
  }
  const answer = String(result.messages.at(-1)?.content ?? "")
  return { answer, toolsUsed, threadId:id };
}

