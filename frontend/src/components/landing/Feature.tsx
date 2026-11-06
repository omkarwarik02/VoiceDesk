import {
  Mic,
  Languages,
  Calendar,
  Flag,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
};
const features: Feature[] = [
  {
    icon: Mic,
    title: "Voice or text",
    text: "Speak when your hands are busy, type when it's quiet. Both work the same way.",
  },
  {
    icon: Languages,
    title: "Speaks your language",
    text: 'Mix Hindi and English the way you normally talk. "Patil ke 50 banners kal tak" just works.',
  },
  {
    icon: Calendar,
    title: "Understands dates",
    text: '"Kal", "parso", "next Monday": VoiceDesk turns them into real dates.',
  },
  {
    icon: Flag,
    title: "Smart priority",
    text: "Every order gets HIGH, MEDIUM or LOW, with the reasons: due tomorrow, VIP, advance paid.",
  },
  {
    icon: RefreshCw,
    title: "Updates by voice",
    text: '"Order 7 ready kar do" changes the status. No forms, no clicking through screens.',
  },
  {
    icon: ShieldCheck,
    title: "Always your call",
    text: "New orders and status changes wait for your approval. Cancel, and nothing changes.",
  },
];

export default function Feature(){

    return(
        <section id="features" aria-labelledby="features-title" className="px-6 pb-16">
            <div className="mx-auto max-w-6xl pt-16 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Features</p>
                <h2 id="features-title" className="mt-5 font-display text-4xl font-semibold">Everything your order desk needs.</h2>
                <p className="mt-4 text-lg text-muted">Nothing it doesn't.</p>
                <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line text-left md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature)=>{
                        const Icon = feature.icon;
                        return(
                            <div key={feature.title} className="bg-bg p-8">
                                <Icon className="h-7 w-7 text-[#FF5FA2]" aria-hidden="true" />
                                 <h3 className="mt-6 font-display text-xl font-semibold">{feature.title}</h3>
                                 <p className="mt-3 text-muted">{feature.text}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )

}