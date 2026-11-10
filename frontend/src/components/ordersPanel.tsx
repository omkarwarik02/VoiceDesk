import type { Order} from "../types/agent";
import OrderCard from "./OrderCard";

type Props ={
    orders:Order[];
    loading:boolean;
    error: string | null;
}

export default function OrdersPanel({orders,loading,error}: Props){
    const active = orders.filter((o)=> o.priority !== null).sort((a,b) => b.priority!.score - a.priority!.score);

    return(
        <div className="space-y-4">
            <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">Orders</h2>
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