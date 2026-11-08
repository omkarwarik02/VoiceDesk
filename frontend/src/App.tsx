import { Show, UserButton } from "@clerk/react";
import LandingPage from "./components/landing/LandingPage";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function App() {
  return (
    <ReactLenis root options={{anchors:true}}>
      <div className="min-h-screen">
      <Show when="signed-out">
        <LandingPage />
      </Show>

      <Show when="signed-in">
        <UserButton />
      
      </Show>
    </div>
    </ReactLenis>
    
  );
}