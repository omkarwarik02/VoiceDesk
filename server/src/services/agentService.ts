import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { graph } from "../agent/agent.js";


export async function askAgent(message: string) {
  const result = await graph.invoke({ messages: [new HumanMessage(message)] });


  const toolsUsed: string[] = [] ;
  for (const msg of result.messages) {
    if (AIMessage.isInstance(msg) && msg.tool_calls?.length) {
      for (const call of msg.tool_calls) {

         toolsUsed.push(call.name);
      }
    }
  }
  const answer = String(result.messages.at(-1)?.content ?? "")
  return { answer, toolsUsed };
}

