import { SignInButton } from "@clerk/react";
import { Code2 } from "lucide-react";
export default function Cta() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-title"
      className="px-6 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-line bg-surface px-6 py-16 text-center">
        <h2 id="cta-title" className="font-display text-4xl font-semibold">
          Your next order is
        </h2>
        <h2 className=" font-display text-4xl font-semibold">
          one sentence away
        </h2>
        <p className="mt-4  text-lg text-muted">
          Sign in and try with your own orders.
        </p>
        <div className=" mt-8 flex flex-wrap gap-4 justify-center items-center">
          <SignInButton>
            <button className="rounded-full bg-linear-to-r from-[#FFD9A8] via-[#FF5FA2] to-[#5B8CFF] px-7 py-3.5 font-semibold text-[#0b0b0f] transition hover:brightness-110 cursor-pointer  ">
              Start talking
            </button>
          </SignInButton>
          <a
            href="https://github.com/omkarwarik02/VoiceDesk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 hover:bg-white/5"
          >
            <Code2 className="h-5 w-5" aria-hidden="true" />
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
