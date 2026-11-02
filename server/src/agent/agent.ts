import "dotenv/config";              
import {
  StateSchema,
  MessagesValue,
  ReducedValue,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import {
  HumanMessage,
  SystemMessage,
  ToolMessage,
  AIMessage,
} from "@langchain/core/messages";
import { z } from "zod";
import type { StructuredToolInterface } from "@langchain/core/tools";
import { VoiceDeskTools } from "./tools.js";
import { todayIST } from "../utils/date.js";


const AgentState = new StateSchema({
  messages: MessagesValue,

  toolCallCount: new ReducedValue(z.number().default(0), {
    reducer: (current, added) => current + added,
  }),
});

function buildSystemPrompt(): string {
  return `You are VoiceDesk, an assistant for a custom-order shop. You help the owner and staff with their orders.

Today is ${todayIST()} (India time). Use it to understand words like "aaj", "kal", "parso" and weekdays.

Users write in Hinglish (Hindi + English mixed). Always reply in simple English.

Answer only using data returned by your tools. Never invent orders, customers, items, amounts or dates. If a tool returns nothing, say so.

Use list_orders to find orders (filters: due, status, customer). Use get_order for full details of one order by its id.

Keep answers short and practical: use a short list for multiple orders, not paragraphs. Mention priority (and the main reason) when it helps, for example when the user asks what is urgent or what to do first.

If a request is unclear, ask one short question. For example, if a name matches more than one customer, or a customer has several orders.

You cannot create or change orders yet. If asked, say this feature is coming soon, and never pretend you did it.`;
}

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
});

const modelWithTools = model.bindTools(VoiceDeskTools);

const modelRetryPolicy = {
  maxAttempts:3,
  initialInterval:10_000,
  backoffFactor:2,
  retryOn:(err:unknown) => err instanceof Error && err.message.includes("429")
}

function callKey(call: { id?: string; name: string; args: unknown }): string {
  return call.id ?? JSON.stringify([call.name, call.args]);
}

const toolsByName: Record<string, StructuredToolInterface> = Object.fromEntries(VoiceDeskTools.map((t) =>[t.name, t]));

const agentNode: GraphNode<typeof AgentState> = async (state) => {
  const response = await modelWithTools.invoke([
    new SystemMessage(buildSystemPrompt()),
    ...state.messages,
  ]);
  return { messages: [response] };
};

const toolsNode: GraphNode<typeof AgentState> = async (state) => {
  const last = state.messages.at(-1);
  if (!last || !AIMessage.isInstance(last) || !last.tool_calls?.length) {
    return {};
  }
  const seen = new Set<string>();
  for (const msg of state.messages.slice(0, -1)) {
    if (AIMessage.isInstance(msg)) {
      for (const call of msg.tool_calls ?? []) seen.add(callKey(call));
    }
  }

  const results : ToolMessage[] =[];
  for(const call of last.tool_calls){
    const key = callKey(call);

    let content : string;

    if(seen.has(key)){
        content = "You already made this exact call. Use the earlier result instead of repeating.";
    } else {
        seen.add(key);
        const tool = toolsByName[call.name];

        if(!tool){
                content = `Error: unknown tool "${call.name}". Available tools: ${Object.keys(toolsByName).join(", ")}.`;
        } else {
            try{
            content = String(await tool.invoke(call.args));
            } catch(err){
                 content = `Error: ${call.name} failed: ${err instanceof Error ? err.message : String(err)}`;
            }
        }
    }
     results.push(
    new ToolMessage({
        content,
        tool_call_id: call.id ?? "",
        name:call.name,
    })
  )
  }
  return { messages:results, toolCallCount:last.tool_calls.length}
 
};

const finalAnswer: GraphNode<typeof AgentState> = async (state) =>{
  const response = await model.invoke([
    new SystemMessage(buildSystemPrompt()),
    ...state.messages,
    new HumanMessage(
       "You have no tool calls left. Answer with what you have now.",
    ),
  ]);
  return { messages:[response]};
}

const MAX_TOOL_CALLS = 4;

const routeAfterAgent = (state: typeof AgentState.State) => {
  const last = state.messages.at(-1);
  if(last && AIMessage.isInstance(last) && last.tool_calls?.length){
    return "tools";
  }
  return END;
}

const routeAfterTools = (state: typeof AgentState.State) => {
  if(state.toolCallCount >= MAX_TOOL_CALLS ){
      return "final_answer";
  }
  return "agent";
};


export const graph = new StateGraph(AgentState)
.addNode("agent", agentNode,{retryPolicy:modelRetryPolicy})
.addNode("tools",toolsNode)
.addNode("final_answer", finalAnswer, {retryPolicy:modelRetryPolicy})
.addEdge(START, "agent")
.addConditionalEdges("agent", routeAfterAgent,["tools", END])
.addConditionalEdges("tools", routeAfterTools,["agent","final_answer"])
.addEdge("final_answer", END)
.compile()

