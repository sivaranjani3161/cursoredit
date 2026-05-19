import AboutHero from "@/features/about/components/Abouthero";
import WhatWeOffer from "@/features/about/components/WhatWeOffer";
import StatsSection from "@/features/about/components/StatsSection";
import TeamSection from "@/features/about/components/TeamSection";

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