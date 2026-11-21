import { AnimatePresence, motion } from "motion/react";
import { Loader } from "@/components/motion/loader";
import { useSplash } from "@/lib/useSplash";
import Cta from "./cta";
import Feature from "./Feature";
import Footer from "./Footer";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import UnderTheHood from "./UnderTheHood";

const MIN_SPLASH_MS = 900;

export default function LandingPage() {
  const loading = useSplash(MIN_SPLASH_MS);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-100 grid place-items-center bg-bg text-fg"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Loader size={40} label="Loading VoiceDesk" />
          </motion.div>
        )}
      </AnimatePresence>
      <main>
        <Hero />
        <HowItWorks />
        <Feature />
        <UnderTheHood />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
