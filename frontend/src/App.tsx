import { Show, UserButton } from "@clerk/react";
import LandingPage from "./components/landing/LandingPage";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import Dashboard from "./components/landing/Dashboard";

export default function App() {
  return (
    
      <div className="min-h-screen">
      <Show when="signed-out">
        <ReactLenis root options={{anchors:true}}>
        <LandingPage />
        </ReactLenis>
      </Show>

      <Show when="signed-in">
        <Dashboard />
      </Show>
    </div>
    
    
  );
}