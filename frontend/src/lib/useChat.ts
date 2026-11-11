import { useState } from "react";
import { useApi } from "./useApi";
import type { AgentResponse, ChatMessage, Approval, ResumeDecision, VoiceResponse, OrderFilter } from "../types/agent";


const DECISION_LABELS:Record<ResumeDecision["action"],string> = {
    approve:"Approved",
    cancel:"Cancelled",
    edit:"Approved with changes",
}


export function useChat( onOrdersChanged:()=> void, onFilterChange:(filter:OrderFilter)=> void){
    const api = useApi();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [threadId, setThreadId] = useState<string | undefined>();
    const [busy, setBusy] = useState(false);
    const [pendingApproval, setPendingApproval]= useState<Approval | null>(null);

    function addMessage(role:ChatMessage["role"], text:string){
        setMessages((prev) => [...prev, {id:crypto.randomUUID(), role,text}]);
    }

    function handleResponse(data:AgentResponse){
        setThreadId(data.threadId);

        if(data.status ==="answered"){
            setPendingApproval(null);
            addMessage("assistant", data.answer)
            if(data.filter) onFilterChange(data.filter);
        } else {
            setPendingApproval(data.approval);
        }
    }

    async function decide(decision:ResumeDecision){
        if(!threadId) return;

        setBusy(true);
        try{
            const response = await api<AgentResponse>("/api/agent/resume",{
                method:"POST",
                body:{threadId, decision}
            });
            addMessage("user", DECISION_LABELS[decision.action]);
            handleResponse(response);
            if(decision.action !== "cancel") onOrdersChanged();

        }catch(err){
           addMessage("assistant", err instanceof Error ? err.message : "Something went wrong.");
        } finally{
            setBusy(false);
        }
    }


    async function send(text:string){
        if(pendingApproval) return;

        addMessage("user", text);
        setBusy(true);

        try{
            const response = await api<AgentResponse>("/api/agent",{
                method:"POST",
                body:{message:text, threadId}
            }) 

            handleResponse(response);


        } catch(err){
            addMessage("assistant", err instanceof Error ? err.message : "Something went wrong");


        } finally{
            setBusy(false);
        }

    }

    async function sendVoice(audio:Blob){
        if(pendingApproval ||  busy) return;

        const form = new  FormData();
        form.append("audio",audio, "voice.webm");
        if(threadId) form.append("threadId", threadId);

       

        setBusy(true);

        try{
            const response = await api<VoiceResponse>("/api/agent/voice",{
                method:"POST",
                body:form
            })
            addMessage("user", response.transcript)
            handleResponse(response)
        } catch(err){
            addMessage("assistant", err instanceof Error ? err.message : "Something went wrong")
        } finally{
            setBusy(false);
        }


    }







    return {messages, busy, send, pendingApproval, decide, sendVoice}

}