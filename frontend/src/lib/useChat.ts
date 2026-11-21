import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import type {
  AgentResponse,
  Approval,
  ChatMessage,
  OrderFilter,
  PendingResponse,
  ResumeDecision,
  ThreadMessagesResponse,
  VoiceResponse,
} from "../types/agent";

const DECISION_LABELS: Record<ResumeDecision["action"], string> = {
  approve: "Approved",
  cancel: "Cancelled",
  edit: "Approved with changes",
};




export function useChat(
  onOrdersChanged: () => void,
  onFilterChange: (filter: OrderFilter) => void,
  initialThreadId: string | null,
  onThreadChange:(threadId:string) => void,
) {
  const api = useApi();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<Approval | null>(null);

  useEffect(() => {
    if(!initialThreadId) return;

    let ignore = false;
    async function load(){
      try{
        const [chat, pending] = await Promise.all([
           api<ThreadMessagesResponse>(`/api/agent/threads/${initialThreadId}`),
        api<PendingResponse>(`/api/agent/pending/${initialThreadId}`),
        ]);
        if(ignore) return;

        setThreadId(chat.threadId);
        setMessages(chat.messages.map((m => ({id:crypto.randomUUID(),role:m.role, text:m.content}))));

        setPendingApproval(pending.approval)
      } catch{
        if(!ignore) addMessage("assistant", "Could not load this conversation")
      }
    }
    load()
    return () => {
      ignore = true;
    };
  }, [api, initialThreadId]);






  

  function addMessage(role: ChatMessage["role"], text: string) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, text }]);
  }

  function handleResponse(data: AgentResponse) {
    setThreadId(data.threadId);
    onThreadChange(data.threadId)

    if (data.status === "answered") {
      setPendingApproval(null);
      addMessage("assistant", data.answer);
      if (data.filter) onFilterChange(data.filter);
    } else {
      setPendingApproval(data.approval);
    }
  }

  async function decide(decision: ResumeDecision) {
    if (!threadId) return;

    setBusy(true);
    try {
      const response = await api<AgentResponse>("/api/agent/resume", {
        method: "POST",
        body: { threadId, decision },
      });
      addMessage("user", DECISION_LABELS[decision.action]);
      handleResponse(response);
      if (decision.action !== "cancel") onOrdersChanged();
    } catch (err) {
      addMessage("assistant", err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function send(text: string) {
    if (pendingApproval) return;

    addMessage("user", text);
    setBusy(true);
    try {
      const response = await api<AgentResponse>("/api/agent", {
        method: "POST",
        body: { message: text, threadId },
      });
      handleResponse(response);
    } catch (err) {
      addMessage("assistant", err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function sendVoice(audio: Blob) {
    if (pendingApproval || busy) return;

    const form = new FormData();
    form.append("audio", audio, "voice.webm");
    if (threadId) form.append("threadId", threadId);

    setBusy(true);
    try {
      const response = await api<VoiceResponse>("/api/agent/voice", {
        method: "POST",
        body: form,
      });
      addMessage("user", response.transcript);
      handleResponse(response);
    } catch (err) {
      addMessage("assistant", err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return { messages, busy, send, pendingApproval, decide, sendVoice };
}