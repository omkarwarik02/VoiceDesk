import "dotenv/config";
import {
  StateSchema,
  MessagesValue,
  ReducedValue,
  StateGraph,
  START,
  END,
  isGraphInterrupt,
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
import { todayLabelIST, upcomingDatesIST } from "../utils/date.js";
import { PostgresSaver} from "@langchain/langgraph-checkpoint-postgres"
import { pool } from "../db/client.js";
import { trimMessages } from "@langchain/core/messages";








export const checkpointer = new PostgresSaver(pool)

const AgentState = new StateSchema({
  messages: MessagesValue,

  toolCallCount: new ReducedValue(z.number().default(0), {
    reducer: (current, added) => current + added,
  }),
});

function buildSystemPrompt(): string {
  return `You are VoiceDesk, an assistant for a custom-order shop. You help the owner and staff with their orders.

Today is ${todayLabelIST()} (India time).${upcomingDatesIST()}
Use these to convert "aaj", "kal", "parso", weekdays and "agle Monday" into exact YYYY-MM-DD dates. Never calculate dates yourself; pick them from this list.

Users write in Hinglish (Hindi + English mixed). Always reply in simple English.

Answer only using data returned by your tools. Never invent orders, customers, items, amounts or dates. If a tool returns nothing, say so.
Use list_orders to find orders (filters: due, status, customer). Use get_order for full details of one order by its id. Use create_order to add a new order. Use update_status to change an order's status. Use delete_order to permanently delete an order.

Keep answers short and practical: use a short list for multiple orders, not paragraphs. Mention priority (and the main reason) when it helps, for example when the user asks what is urgent or what to do first.

If a request is unclear, ask one short question. For example, if a name matches more than one customer, or a customer has several orders.
For customerName, use the name without honorifics like ji, bhai, sir or madam (e.g. ‘Joshi ji’ → ‘Joshi’)

You can create new orders with create_order. Before calling it, make sure you know the customer name and at least one item with a quantity; if anything is missing, ask. The owner must approve every new order, so never say an order is created until the tool confirms it.
Use update_status to change an order's status. Use delete_order only when the owner asks to delete or remove an order; if they say cancel, use update_status with cancelled instead. Never say an order is deleted or changed until the tool confirms it.
Do not use tables, bold, or any markdown. Write plain text: one short line per order starting with ‘- ‘, at most 5 lines.
If the user agrees to a change that needs several steps, do all the steps one after another before giving your final answer.
Use update_order when the owner changes details of an existing order, for example "parso tak kar do", "advance 500 diya", "urgent kar do", "50 nahi 80 chahiye". First find the order id with list_orders; if several orders match, ask which one. Send only the fields that change. When changing items, send the full updated items list, including items that stay the same. Convert dates the same way as for new orders. Status changes always go to update_status, not update_order.
For due dates: "kal" means tomorrow and "parso" means the day after tomorrow (never the past). A due date can never be before today.

`;


}

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
});

const modelWithTools = model.bindTools(VoiceDeskTools);

const modelRetryPolicy = {
  maxAttempts: 3,
  initialInterval: 10_000,
  backoffFactor: 2,
  retryOn: (err: unknown) =>
    err instanceof Error && err.message.includes("429"),
};

function callKey(call: { name: string; args: unknown }): string {
  return `${call.name}:${JSON.stringify(call.args)}`;
}

const toolsByName: Record<string, StructuredToolInterface> = Object.fromEntries(
  VoiceDeskTools.map((t) => [t.name, t]),
);

const agentNode: GraphNode<typeof AgentState> = async (state) => {
  const recent = await trimMessages(state.messages,{
    maxTokens:20,
    strategy:"last",
    tokenCounter:(msgs) =>msgs.length,
    startOn:"human",

  })

  const response = await modelWithTools.invoke([
    new SystemMessage(buildSystemPrompt()),
    ...recent,
  ]);
  return { messages: [response] };
};

const toolsNode: GraphNode<typeof AgentState> = async (state,config) => {
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

  const results: ToolMessage[] = [];
  for (const call of last.tool_calls) {
    const key = callKey(call);

    let content: string;

    if (seen.has(key)) {
      content =
        "You already made this exact call. Use the earlier result instead of repeating.";
    } else {
      seen.add(key);
      const tool = toolsByName[call.name];

      if (!tool) {
        content = `Error: unknown tool "${call.name}". Available tools: ${Object.keys(toolsByName).join(", ")}.`;
      } else {
        try {
          content = String(await tool.invoke(call.args,config));
        } catch (err) {
          if(isGraphInterrupt(err)) throw err;
          content = `Error: ${call.name} failed: ${err instanceof Error ? err.message : String(err)}`;
        }
      }
    }
    results.push(
      new ToolMessage({
        content,
        tool_call_id: call.id ?? "",
        name: call.name,
      }),
    );
  }
  return { messages: results, toolCallCount: last.tool_calls.length };
};

const finalAnswer: GraphNode<typeof AgentState> = async (state) => {
  const response = await model.invoke([
    new SystemMessage(buildSystemPrompt()),
    ...state.messages,
    new HumanMessage(
      "You have no tool calls left. Answer with what you have now.",
    ),
  ]);
  return { messages: [response] };
};

const MAX_TOOL_CALLS = 4;

const routeAfterAgent = (state: typeof AgentState.State) => {
  const last = state.messages.at(-1);
  if (last && AIMessage.isInstance(last) && last.tool_calls?.length) {
    return "tools";
  }
  return END;
};

const routeAfterTools = (state: typeof AgentState.State) => {
  if (state.toolCallCount >= MAX_TOOL_CALLS) {
    return "final_answer";
  }
  return "agent";
};

export const graph = new StateGraph(AgentState)
  .addNode("agent", agentNode, { retryPolicy: modelRetryPolicy })
  .addNode("tools", toolsNode)
  .addNode("final_answer", finalAnswer, { retryPolicy: modelRetryPolicy })
  .addEdge(START, "agent")
  .addConditionalEdges("agent", routeAfterAgent, ["tools", END])
  .addConditionalEdges("tools", routeAfterTools, ["agent", "final_answer"])
  .addEdge("final_answer", END)
  .compile({ checkpointer});
