import type { Order} from "../types/agent";
import OrderCard from "./OrderCard";
import type { OrderFilter } from "../types/agent";
type Props ={
    orders:Order[];
    loading:boolean;
    error: string | null;
      filter: OrderFilter | null;    
  onClearFilter: () => void; 
}

export default function OrdersPanel({orders,loading,error,filter,onClearFilter}: Props){
    const active = orders.filter((o)=> o.priority !== null).sort((a,b) => b.priority!.score - a.priority!.score);
    const hasFilter = !!(filter?.customer || filter?.status || filter?.due);
    return(
        <div className="space-y-4">
            <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">Orders</h2>
                <div className="flex items-center gap-3">
                    {hasFilter && (
                        <button
                        type="button"
                        onClick={onClearFilter}
                        className="rounded-full px-2.5 py-0.5 text-xs text-muted hover:bg-white/10 hover:text-fg"
                        >
                              ✕ Clear filter
                        </button>
                    )}
                </div>
                <span className="text-sm text-muted">{active.length} active</span>
            </div>
            {loading && orders.length === 0 ? (
                <p className="text-sm text-muted">Loading orders...</p>    
            ): error ? (
                <p className="text-sm text-red-300">{error}</p>
            ): active.length === 0 ? (
                <p className="text-sm text-muted">No active orders. Create one from the chat.</p>
            ):(
                <div className="space-y-3">
                    {active.map((order) =>(
                        <OrderCard  key={order.id} order={order}/>
                    ))}
                </div>
            )}
        </div>
    )
}