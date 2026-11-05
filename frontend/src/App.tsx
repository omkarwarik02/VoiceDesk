import { Show, SignInButton, UserButton } from "@clerk/react";
import "./App.css";

export default function App() {
  return <div className="min-h-screen bg-slate-100 p-6">
    <Show when="signed-out">
       <SignInButton />
    </Show>
    <Show when="signed-in">
      <UserButton />
      <p>Logged in. VoiceDesk goes here.</p>
    </Show>
  </div>;
}
