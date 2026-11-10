import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import type { Order, OrderResponse } from "../types/agent";


export  function useOrders(){
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
const api = useApi()

useEffect(() => {
    let ignore = false;

   async function load(){

    try{
        const response = await api<OrderResponse>("/api/orders");
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
},[api,version]);


function refresh(){
    setLoading(true);
    setVersion((v) => v + 1);
}

     return { orders, loading, error, refresh}

}