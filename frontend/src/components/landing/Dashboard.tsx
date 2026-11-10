import { UserButton } from "@clerk/react";
import logo  from "../../assets/voicedesk.png"
import ChatPanel from "../chatPanel";


import { useOrders } from "../../lib/useOrders";
import OrdersPanel from "../ordersPanel";


export default function Dashboard() {
  const {orders, loading, error, refresh} = useOrders();
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
        <img src={logo} alt="VoiceDesk" className="h-8" />
        <UserButton />
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="w-96 shrink-0 overflow-y-auto border-r border-line p-5 xl:w-120">
          <OrdersPanel orders={orders} loading={loading} error={error} />
          
        </aside>
        <main className="flex min-w-0 min-h-0 flex-1 flex-col">
         <ChatPanel onOrdersChanged={refresh} />
         
         
        </main>
      </div>
    </div>
  );
}
