import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import type { Order, OrderResponse,OrderFilter } from "../types/agent";


export  function useOrders(filter:OrderFilter | null){
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
const api = useApi();

const params = new URLSearchParams();
if(filter?.status) params.append("status",filter.status);
 if (filter?.due) params.append("due", filter.due);
  if (filter?.customer) params.append("customer", filter.customer);
  const query = params.toString();


useEffect(() => {
    let ignore = false;

   async function load(){

    try{
        const response = await api<OrderResponse>(query ? `/api/orders?${query}` : "/api/orders");
        if(!ignore){
            setOrders(response.orders);
            setError(null)
        }
    } catch(err){
       if(!ignore) setError(err instanceof  Error ? err.message : "Could not load orders")
    } finally{
        if(!ignore) setLoading(false)
    }
   }
   load()
    return () => {
        ignore = true;
    };
},[api,version,query]);


function refresh(){
    setLoading(true);
    setVersion((v) => v + 1);
}

     return { orders, loading, error, refresh}

}