import { useEffect, useState } from "react";
import type { ThreadsResponse, ThreadSummary } from "../types/agent";
import { useApi } from "./useApi";



export function useThreads(){
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [threads , setThreads] = useState<ThreadSummary[]>([])
const [version, setVersion] = useState(0);

const api = useApi();



useEffect(() =>{
    let ignore = false;
    async function load(){
        try{
            const response = await api<ThreadsResponse>("/api/agent/threads")
            if(!ignore){
                setThreads(response.threads);
                setError(null);
            }
        
        } catch(err){
            if(!ignore) setError(err instanceof Error ? err.message : "Could not load messages")
        } finally {
            if(!ignore) setLoading(false);
        }
    }
    load()
    return () =>{
        ignore = true;
    };
},[api,version])


function refresh(){
    setLoading(true);
    setVersion((v)=> v + 1);
}

return { threads,loading, error, refresh}

}