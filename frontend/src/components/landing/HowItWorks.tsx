const steps = [
  {
    number: "01",
    title: "You talk",
    text: "Hold the mic and say it the way you'd tell your team.",
  },
  {
    number: "02",
    title: "It types",
    text: "VoiceDesk finds the customer, fills in the items and due date, and ranks the priority.",
  },
  {
    number: "03",
    title: "You decide",
    text: "Approve, edit or cancel. Nothing is saved without you.",
  },
];

export default function HowItWorks(){
    return(
        <section id="how-it-works" aria-labelledby="how-title" className="px-6 py-16">
            <div className="mx-auto max-w-6xl pt-16 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">How it works</p>
                <h2 id="how-title" className="mt-5 font-display text-4xl font-semibold">From a sentence to an order in three steps.</h2>
            <div className="mt-16 grid gap-12 text-left md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
                {steps.map((step) =>(
                    <div key={step.number} className="md:px-9">
                        <p className="bg-linear-to-r from-[#FFD9A8] via-[#FF5FA2] to-[#5B8CFF] bg-clip-text font-display text-7xl text-transparent">{step.number}</p>
                        <h3 className="mt-6 font-display text-2xl font-semibold">{step.title}</h3>
                        <p className="mt-3 text-muted">{step.text}</p>
                        
                    </div>
                ))}

            </div>
            

            </div>
        </section>
    )
}