import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { graph } from "../agent/agent.js";
import type { ResumeDecision } from "../validation/order.schema.js";
import { Command } from "@langchain/langgraph";


async function buildResult(result:{messages:BaseMessage[]}, id:string){
  const snapShot = await graph.getState({ configurable:{thread_id:id}});
  const pending = snapShot.tasks.flatMap((task)=> task.interrupts);

  if(pending.length > 0){
    const value = pending[0]!.value as {draft:unknown}
    return{
      status:"needs_approval" as const,
      approval:pending[0]!.value,
      threadId:id,
    };
  }

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
  return { status:"answered" as const ,answer, toolsUsed, threadId:id };

}


export async function askAgent(message: string, threadId?:string) {
  const id = threadId ?? crypto.randomUUID()
  const result = await graph.invoke({ messages: [new HumanMessage(message)] },{configurable:{thread_id:id}});

  return buildResult(result,id)

}

export async function resumeAgent(threadId: string, decision:ResumeDecision){
  const config = { configurable:{ thread_id: threadId}};

  const snapshot = await graph.getState(config);
  const pending = snapshot.tasks.flatMap((task)=>task.interrupts);

  if(pending.length === 0){
    return {status:"nothing_to_resume" as const , threadId};
  }

  const result = await graph.invoke(new Command({resume: decision}),config);

  return buildResult(result, threadId);
}


