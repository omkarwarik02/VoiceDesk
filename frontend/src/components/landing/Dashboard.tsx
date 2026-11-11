import { useAuth, UserButton } from "@clerk/react";
import logo  from "../../assets/voicedesk.png"
import ChatPanel from "../chatPanel";
import { SquarePen } from "lucide-react";
import { useOrders } from "../../lib/useOrders";
import OrdersPanel from "../ordersPanel";
import { useState } from "react";
import type { OrderFilter } from "../../types/agent";
import { clearThread } from "../../lib/useChat";


export default function Dashboard() {
    const { userId } = useAuth();
     const [chatKey, setChatKey] = useState(0);
  const[filter, setFilter] = useState<OrderFilter | null>(null);
  const {orders, loading, error, refresh} = useOrders(filter);


function newConversation(){
  if(userId) clearThread(userId);
  setChatKey((k) => k + 1)
}


  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
        <img src={logo} alt="VoiceDesk" className="h-8" />
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={newConversation}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-fg"
          >
            <SquarePen className="size-4" />
            New conversation
          </button>
          </div>
        <UserButton />
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="w-96 shrink-0 overflow-y-auto border-r border-line p-5 xl:w-120">
          <OrdersPanel orders={orders} loading={loading} error={error} filter={filter} onClearFilter={() => setFilter(null)} />
          
        </aside>
        <main className="flex min-w-0 min-h-0 flex-1 flex-col">
         <ChatPanel key={chatKey} onOrdersChanged={refresh}   onFilterChange={setFilter}/>
         
         
        </main>
      </div>
    </div>
  );
}
