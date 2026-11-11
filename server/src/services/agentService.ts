import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { graph } from "../agent/agent.js";
import { ListOrdersQuery, ListOrdersToolInput, type ResumeDecision } from "../validation/order.schema.js";
import { Command } from "@langchain/langgraph";
import {eq} from "drizzle-orm";
import {db} from "../db/client.js";
import { agentThreads } from "../db/schema.js";

async function buildResult(result:{messages:BaseMessage[]}, id:string){
  const snapShot = await graph.getState({ configurable:{thread_id:id}});
  const pending = snapShot.tasks.flatMap((task)=> task.interrupts);

  if(pending.length > 0){
    return{
      status:"needs_approval" as const,
      approval:pending[0]!.value,
      threadId:id,
    };
  }

const start = result.messages.findLastIndex((m)=> HumanMessage.isInstance(m));
  const toolsUsed: string[] = [] ;
  let filter: ListOrdersQuery | null = null ;
  
  for (const msg of result.messages.slice(start + 1)) {
    if (AIMessage.isInstance(msg) && msg.tool_calls?.length) {
      for (const call of msg.tool_calls) {

         toolsUsed.push(call.name);
        if(call.name === "list_orders"){
          const parsed = ListOrdersToolInput.safeParse(call.args);
          if(parsed.success){
            filter = { status: parsed.data.status   ?? undefined, due:parsed.data.due ?? undefined,  customer: parsed.data.customer ?? undefined,}
          }
        }
      }
    }
  }
  const answer = String(result.messages.at(-1)?.content ?? "")
  return { status:"answered" as const ,answer, toolsUsed, threadId:id ,filter };

}


export async function askAgent(userId:string,message: string, threadId?:string) {
  let id:string;

  if(threadId){
    if(!(await ownsThread(userId, threadId))){
      return {status:"thread_not_found" as const , threadId}
    }
    id = threadId;
  } else {
    id = crypto.randomUUID();
    await db.insert(agentThreads).values({threadId:id, userId})
  }
  
  const result = await graph.invoke({ messages: [new HumanMessage(message)] },{configurable:{thread_id:id,userId}});

  return buildResult(result,id)

}

export async function resumeAgent(userId:string,threadId: string, decision:ResumeDecision){
  if(!(await ownsThread(userId, threadId))){
    return { status:"thread_not_found" as const, threadId }
  }
  const config = { configurable:{ thread_id: threadId,userId}};

  const snapshot = await graph.getState(config);
  const pending = snapshot.tasks.flatMap((task)=>task.interrupts);

  if(pending.length === 0){
    return {status:"nothing_to_resume" as const , threadId};
  }

  const result = await graph.invoke(new Command({resume: decision}),config);

  return buildResult(result, threadId);
}

async function ownsThread(userId:string, threadId:string):Promise<boolean>{
  const [thread] = await db
    .select()
    .from(agentThreads)
    .where(eq(agentThreads.threadId, threadId))
    .limit(1)

    return thread?.userId === userId;
}

