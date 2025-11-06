"use client";
import { useRef, useCallback } from 'react';
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
  // 1. Create a ref for the target section (WaitlistSection)
  const waitlistRef = useRef<HTMLDivElement>(null);

  // 2. Create the scroll function using the ref
  const scrollToWaitlist = useCallback(() => {
    if (waitlistRef.current) {
      // Use scrollIntoView with 'smooth' behavior for the best result
      // This is generally preferred over calculating offsets with window.scrollTo() in React/Next.js
      waitlistRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start", // Aligns the top of the element with the top of the viewport
      });
    }
  }, []);
  return (
    <ScrollBackground>
      <main className="pt-21 min-h-screen text-[#2D3436] overflow-visible -my-20">
        <Navbar />
        
        {/* Hero Section */}
        <RippleWrapper>
          <SlideInSection direction="up">
            <Hero onScrollToWaitlist={scrollToWaitlist} />
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
            <div ref={waitlistRef}> {/* <-- Attach the ref to a wrapper or the component's main div */}
              <WaitlistSection />
            </div>
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