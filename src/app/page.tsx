"use client";
import HowItWorks from "./components/HowItWorks";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FinalSection from "./components/FinalSection";
import WhatIsWhimsera from "./components/WhatIsWhimsera";
import AIMagic from "./components/AIMagic";
import Footer from "./components/Footer";
import SlideInSection from "./components/SlideInSection";

export default function Home() {
  return (
    <main className="pt-26 min-h-screen text-[#2D3436] overflow-x-hidden">
      <Navbar />

      <SlideInSection direction="up">
        <Hero />
      </SlideInSection>

      <SlideInSection direction="left">
        <WhatIsWhimsera />
      </SlideInSection>

      <SlideInSection direction="right">
        <AIMagic />
      </SlideInSection>

      <SlideInSection direction="up">
        <HowItWorks />
      </SlideInSection>

      <SlideInSection direction="up">
        <FinalSection />
      </SlideInSection>

      <Footer />
    </main>
  );
}
