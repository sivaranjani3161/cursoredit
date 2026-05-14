import AboutHero from "@/app/components/Aboutus/Abouthero";
import WhatWeOffer from "@/app/components/Aboutus/WhatWeOffer";
import StatsSection from "../components/Aboutus/StatsSection";
import TeamSection from "../components/Aboutus/TeamSection";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhatWeOffer />
      <StatsSection />
      <TeamSection />
    </>
  );
}