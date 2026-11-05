import { useCallback } from "react";
import { useAuth } from "@clerk/react";

export const API_URL = import.meta.env.VITE_API_URL;

type apiOptions = {
    method?:"GET" | "POST" | "PATCH";
    body?:unknown;
}

export function useApi(){
    const { getToken} = useAuth();


    return useCallback(
        async <T,>(path:string, options:apiOptions ={}): Promise<T> =>{

            const token = await getToken();
            const headers: Record<string,string> = {};
            if(token) headers.Authorization = `Bearer ${token}`;


            let body: BodyInit | undefined;
            if(options.body instanceof FormData){
                body = options.body;
            } else if (options.body !== undefined){
                headers["Content-Type"] = "application/json";
                body = JSON.stringify(options.body);
            }


            const res = await fetch(`${API_URL}${path}`,{
                method:options.method ?? "GET",
                headers,
                body,
            });
            
            const data = await res.json().catch(() => ({}));
            if(!res.ok){
                throw new Error(data.error ?? `Request failed (${res.status})`)
            }
            return data as T 
            
        },
        [getToken] 
    )




















}
