import { useState } from "react"
import type { ChatMessage } from "../types/agent"
import PromptBar from "../components/PromptBar";



export default function ChatPanel(){
const [messages, setMessages] = useState<ChatMessage[]>([])
function handleSend(text:string){
    setMessages((prev) => [
  ...prev,
  { id: crypto.randomUUID(), role: "user", text },
  { id: crypto.randomUUID(), role: "assistant", text: "Test reply from the agent" },
]);
}

    return (
<>
<div className="min-h-0 flex-1 overflow-y-auto px-12 py-8">
            <div className="mx-auto max-w-3xl space-y-4">
                {messages.map((m) =>(
                   <div
                   key={m.id}
                   className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                   >
                    <div className={m.role === "user" ? "max-w-[75%] rounded-2xl bg-white/10 px-4 py-2.5" : "max-w-[75%] py-2.5 text-fg"}>
                        {m.text}
                    </div>

                   </div>
                ))}
            </div>
        </div>

        <div className="flex shrink-0 justify-center px-12 py-5">
                <div className="w-full max-w-3xl">
                    <PromptBar width={768} models={[]} efforts={[]} onSend={handleSend} />
                </div>
        </div>
        </>
        
    )

}