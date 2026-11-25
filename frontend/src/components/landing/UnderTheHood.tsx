import { Fragment } from "react/jsx-runtime";
import type { ReactNode } from "react";

type Point = {
    title:string;
    text:ReactNode
}

const codeClass = "rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-sm text-fg";


const points: Point[] = [
     {
    title: "It uses tools",
    text: (
      <>
        The agent calls real functions, like <code className={codeClass}>list_orders</code> and{" "}
        <code className={codeClass}>create_order</code>, instead of guessing answers.
      </>
    ),
  },
  {
    title: "It pauses for you",
    text: "Before saving or changing anything, it stops and waits for your approval, even across a server restart.",
  },
  {
    title: "It remembers",
    text: 'Ask "uska advance kitna hai?" and it knows which order you mean. Each conversation is stored in Postgres.',
  },
  {
    title: "Rules stay in code",
    text: "Dates, status changes and priority scores are calculated by code, not by the AI, so they stay consistent.",
  },
]



const pipeline = ["Voice", "Whisper", "LangGraph agent", "Tools", "Your approval", "Postgres"];
const highlighted = ["LangGraph agent", "Your approval"];
export default function UnderTheHood(){

    return(
        <section id="underthehood" aria-labelledby="underthehood-title" className="px-5 py-20 md:px-6 md:py-32">
            <div className="mx-auto max-w-6xl text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">under the hood</p>
                <h2 id="underthehood-title" className="mt-5 text-balance font-display text-3xl font-semibold md:text-4xl">A real agent, not just a chatbot.</h2>
                <div className="mt-12 flex flex-wrap items-center justify-center gap-2 md:mt-16 md:gap-3">
                    {pipeline.map((step,index)=>(
                        <Fragment key={step}>
                            <span
                            className={
                                highlighted.includes(step)
                                 ? "rounded-full bg-linear-to-r from-[#FFD9A8] via-[#FF5FA2] to-[#5B8CFF] px-4 py-2 text-sm font-semibold text-[#0b0b0f] md:px-5 md:py-2.5 md:text-base"  : "rounded-full border border-line bg-surface px-4 py-2 text-sm md:px-5 md:py-2.5 md:text-base"
                            }
                            >
                                {step}

                            </span>
                            {index < pipeline.length - 1 && <span className="text-muted" aria-hidden="true">→</span>} 
                        </Fragment>
                    ))}
                   
                </div>
                <div className="mt-12 md:mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line text-left md:grid-cols-2 ">
                    {points.map((point)=>(
                        <div key={point.title} className="bg-bg p-6 md:p-8">
                            <h3 className="font-display text-xl font-semibold">{point.title}</h3>
                            <p className="mt-3 text-muted">{point.text}</p>
                        </div>


                    ))}

                </div>
            
            </div>
        </section>
    )
}