import { Show, SignInButton, UserButton } from "@clerk/react";
import "./App.css";
import { useApi } from "./lib/useApi";
import { useState } from "react";

export default function App() {

  const api = useApi();
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);



  async function testApi(){
    try{
      setError(null);
      const data = await api<{ count:number}>("/api/orders");
      setCount(data.count);
    } catch(err){
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }








  return <div className="min-h-screen bg-slate-100 p-6">
    <Show when="signed-out">
       <SignInButton />
    </Show>
    <Show when="signed-in">
      <UserButton />
      <button
          onClick={testApi}
          className="mt-4 block rounded bg-teal-500 px-4 py-2 font-medium text-slate-950 hover:bg-teal-400"
        >
          Test API
        </button>
     {count !== null && <p className="mt-2 text-teal-400">Orders:{count}</p>}
     {error && <p className="mt-2 text-red-400">{error}</p>}
    </Show>
  </div>;
}
