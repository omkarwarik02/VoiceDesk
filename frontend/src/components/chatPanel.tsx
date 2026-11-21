
import { useState } from "react";
import PromptBar from "../components/PromptBar";
import { useChat } from "../lib/useChat";
import { useVoice } from "../lib/useVoice";
import ApprovalCard from "./ApprovalCard";
import LatticeLoader from "./LatticeLoader";
import {Mic, Square} from "lucide-react"
import type { OrderFilter } from "../types/agent";

type Props = {
  onOrdersChanged: () => void;
  onFilterChange: (filter: OrderFilter) => void;
  initialThreadId:string | null;
  onThreadChange:(threadId:string) => void;
};


export default function ChatPanel({ onOrdersChanged, onFilterChange,initialThreadId, onThreadChange }:Props){
    const [micError, setMicError] = useState<string | null>(null)
    const { messages, busy, send, decide, pendingApproval, sendVoice} = useChat( onOrdersChanged, onFilterChange, initialThreadId, onThreadChange);
    const {containerRef, recording , start, stop } = useVoice();

   async function handleMic(){
    try{
        if(recording){
            const audio = await stop();
            await sendVoice(audio);

        } else {
            setMicError(null);
            await start()
        }

    } catch{
        setMicError("Allow microphone access to use voice",);
    }
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
                <div className="w-full max-w-3xl flex flex-row items-center gap-x-3">
                   <button
                    type="button"
                    onClick={handleMic}
                    disabled={!recording && (busy || !!pendingApproval)}
                    aria-label={recording ? "Stop recording and send" : "Start voice recording"}
                    aria-pressed={recording}
                    title={recording ? "Stop & send" : "Speak"}
                    className={`group relative grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${
                        recording
                            ? "border-red-500/60 bg-red-500/15 text-red-400 shadow-[0_0_24px_-4px_rgba(239,68,68,0.6)] hover:bg-red-500/25"
                            : "border-line bg-surface text-fg hover:border-accent/50 hover:bg-accent/10 hover:text-accent hover:shadow-[0_0_20px_-6px_rgba(45,212,191,0.6)]"
                    }`}
                   >
                    {recording && (
                        <span aria-hidden className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-red-500/50" />
                    )}
                    {recording
                        ? <Square className="relative size-4 fill-current" />
                        : <Mic className="relative size-5 transition-transform duration-200 group-hover:scale-110" />}
                   </button>
                   <div className="relative flex-1 min-w-0">
                     <PromptBar width={768} models={[]} efforts={[]} onSend={send} busy={busy} />
                     <div className={`absolute inset-0 flex items-center gap-3 rounded-2xl bg-[#27272a] px-4 ${recording ? "opacity-100" : "opacity-0 pointer-events-none"}`} >
                        < span className="size-2 shrink-0 animate-pulse rounded-full bg-red-500"/>
                        <span className="text-sm text-muted">Recording</span>
                          <div ref={containerRef} className="flex-1"/>
                     </div>
                   

                   </div>
                   {micError && <p className="mt-2 text-sm text-red-300">{micError}</p>}
                    
                </div>
        </div>
        </>
        
    )

}