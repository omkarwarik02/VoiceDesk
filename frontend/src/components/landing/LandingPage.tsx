import Cta from "./cta";
import Feature from "./Feature";
import Footer from "./Footer";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import UnderTheHood from "./UnderTheHood";

export default function LandingPage() {
  return (
    <>
     <main>
    <Hero />
    <HowItWorks />
    <Feature/>
    <UnderTheHood/>
    <Cta/>
   </main>
   <Footer />
   </>
  
  );
}
