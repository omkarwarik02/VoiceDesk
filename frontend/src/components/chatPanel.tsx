
import PromptBar from "../components/PromptBar";
import { useChat } from "../lib/useChat";
import ApprovalCard from "./ApprovalCard";
import LatticeLoader from "./LatticeLoader";



export default function ChatPanel({ onOrdersChanged}:{onOrdersChanged:()=> void}){

    const { messages, busy, send, decide, pendingApproval} = useChat( onOrdersChanged);

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
                {pendingApproval && (
                    <ApprovalCard approval={pendingApproval} busy={busy} onDecide={decide} />
                )}
            </div>
        </div>
        {busy && (
            <div className="flex justify-end p-6">
                <LatticeLoader />
        </div>

        )}
        
         

        <div className="flex shrink-0 justify-center px-12 py-5">
                <div className="w-full max-w-3xl">
                    <PromptBar width={768} models={[]} efforts={[]} onSend={send} busy={busy} />
                </div>
        </div>
        </>
        
    )

}