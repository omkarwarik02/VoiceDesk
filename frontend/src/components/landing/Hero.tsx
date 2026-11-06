import { SignInButton } from "@clerk/react";
import SlicedWaves from "../SlicedWaves";
import PillNav from "../PillNav";
import logo from "../../assets/voicedesk.png";
import { Mic } from "lucide-react";
import { AnimatedGroup } from "../animated-group";


export default function Hero(){
    return (
         <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-[55%] ">
        <SlicedWaves />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-bg" />
      </div>
      <AnimatedGroup
        preset="blur-slide"
        className="relative z-10 flex h-full flex-col items-center justify-start px-6 pt-40 gap-5 text-center"
      >
        <h1 className="text-white text-6xl font-semibold font-display">
          YOU TALK. IT TYPES. YOU DECIDE.
        </h1>
        <p className="text-lg text-muted">
          Voice in, structured orders out, with you approving every step.
        </p>
        <div>
          <SignInButton>
            <button className="rounded-full bg-linear-to-r from-[#FFD9A8] via-[#FF5FA2] to-[#5B8CFF] px-7 py-3.5 font-semibold text-[#0b0b0f] transition hover:brightness-110 cursor-pointer">
              Start talking
            </button>
          </SignInButton>
          <a href="#how-it-works" className="ml-5 inline-block rounded-full border border-line px-7 py-3.5 hover:bg-white/5">
            See how it works
          </a>
        </div>
        <div className="rounded-full border border-line px-7 py-2 bg-surface flex flex-row items-center justify-center gap-2 mt-10">
          <Mic className=" w-4 text-red-500" aria-hidden="true"size={20} />
          <small>
            Try: <span>"50 banners for omkar by tomorrow"</span>
          </small>
        </div>
      </AnimatedGroup>

      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
          <a href="#" className="shrink-0">
            <img src={logo} alt="VoiceDesk" className="h-10 w-auto" />
          </a>
          <div className="flex min-w-0 flex-1 justify-center">
            <PillNav
              items={[
                { label: "How it works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                {
                  label: "GitHub",
                  href: "https://github.com/omkarwarik02/VoiceDesk",
                },
              ]}
              theme="dark"
              layout="split"
              surface="none"
              itemStyle="plain"
              hoverEffect="none"
              indicator="none"
              highlightColor="#f4f4f5"
            />
          </div>
          <SignInButton>
            <button className="shrink-0 rounded-full border border-line  px-4 py-1.5 text-sm hover:bg-white/5 cursor-pointer">
              Sign in
            </button>
          </SignInButton>
        </div>
      </header>
    </section>
    )
}
