import Feature from "./Feature";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import UnderTheHood from "./UnderTheHood";

export default function LandingPage() {
  return (
   <main>
    <Hero />
    <HowItWorks />
    <Feature/>
    <UnderTheHood/>
   </main>
  );
}
