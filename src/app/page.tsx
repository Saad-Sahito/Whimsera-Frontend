"use client";
import RippleWrapper from "./components/RippleWrapper";
import ScrollBackground from "./components/ScrollBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import GenreShowcase from "./components/GenreShowcase";
import InteractiveDemo from "./components/InteractiveDemo";
import HowItWorks from "./components/HowItWorks";
import AIMagic from "./components/AIMagic";
import CreativeFreedom from "./components/CreativeFreedom";
import WaitlistSection from "./components/WaitlistSection";
import FinalSection from "./components/FinalSection";
import Footer from "./components/Footer";
import SlideInSection from "./components/SlideInSection";

export default function Home() {
  return (
    <ScrollBackground>
      <main className="pt-21 min-h-screen text-[#2D3436] overflow-x-hidden">
        <Navbar />
        
        {/* Hero Section */}
        <RippleWrapper>
          <SlideInSection direction="up">
            <Hero />
          </SlideInSection>
        </RippleWrapper>

        {/* Genre Showcase */}
        <RippleWrapper className="light-section">
          <SlideInSection direction="right">
            <GenreShowcase />
          </SlideInSection>
        </RippleWrapper>

        {/* Interactive Demo */}
        <RippleWrapper>
          <SlideInSection direction="left">
            <InteractiveDemo />
          </SlideInSection>
        </RippleWrapper>

        {/* How It Works */}
        <RippleWrapper>
          <SlideInSection direction="up">
            <HowItWorks />
          </SlideInSection>
        </RippleWrapper>

        {/* AI Magic */}
        <RippleWrapper className="light-section">
          <SlideInSection direction="right">
            <AIMagic />
          </SlideInSection>
        </RippleWrapper>

        {/* Creative Freedom */}
        <RippleWrapper>
          <SlideInSection direction="left">
            <CreativeFreedom />
          </SlideInSection>
        </RippleWrapper>

        {/* Waitlist Section */}
        <RippleWrapper>
          <SlideInSection direction="up">
            <WaitlistSection />
          </SlideInSection>
        </RippleWrapper>

        {/* Final Section with Erasing Effect */}
        <RippleWrapper>
          <SlideInSection direction="up">
            <FinalSection />
          </SlideInSection>
        </RippleWrapper>

        <Footer />
      </main>
    </ScrollBackground>
  );
}