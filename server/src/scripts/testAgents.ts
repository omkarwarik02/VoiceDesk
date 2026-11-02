import { graph } from "../agent/agent.js";
import { AIMessage, HumanMessage } from "langchain";
import { pool } from "../db/client.js";

const questions = [
  "aaj kya due hai?",
  "Mehta ka order kahan tak hai?",
  "Patil ka cake order add karo",
];

for (const q of questions) {
  const result = await graph.invoke({ messages: [new HumanMessage(q)] });
  console.log(q);

  for( const msg of result.messages){
    if(AIMessage.isInstance(msg) && msg.tool_calls?.length){
        for(const call of msg.tool_calls ){
             console.log(`🔧 ${call.name}(${JSON.stringify(call.args)})`);
        }
        
    }
  }

  console.log(`🤖${result.messages.at(-1)?.content}`);
 

}
 await pool.end();
