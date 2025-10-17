"use client";

import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SlideInSection from "../components/SlideInSection";
export default function About() {
  const Section = ({
    direction = "up",
    title,
    icon,
    children,
  }: {
    direction?: "up" | "left" | "right";
    title: string;
    icon: string;
    children: React.ReactNode;
  }) => (
    <SlideInSection direction={direction}>
      <section className="text-center max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Icon centered above header */}
          <Image
            src={icon}
            alt=""
            fill
            sizes="56px"
            className="object-contain"
          />
          <h2 className="text-[40px] font-bold font-fredoka text-slateblue">
            {title}
          </h2>
        </div>
        <div className="text-[36px] leading-relaxed font-light font-nunito text-[#2D3436]/90">
          {children}
        </div>
      </section>
    </SlideInSection>
  );

  return (
    <main className="min-h-screen text-[#2D3436]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-32 space-y-40">
        {/* About Whimsera */}
        <SlideInSection direction="up">
          <div className="text-center max-w-4xl mx-auto space-y-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <Image
                src="/book.png"
                alt="About icon"
                fill
                sizes="56px"
                className="object-contain"
              />
              <h1 className="text-[40px] font-bold font-fredoka text-slateblue">
                About
              </h1>
            </div>
            <p className="text-[36px] leading-relaxed font-light font-nunito text-[#2D3436]/90">
              Whimsera was created for dreamers, readers, and explorers of
              imagination. We believe everyone has a story waiting to unfold, and
              our AI helps bring those tales to life.
            </p>
          </div>
        </SlideInSection>

        {/* Magic Behind Whimsera */}
        <Section
          direction="left"
          title="The Magic Behind Whimsera"
          icon="/crystal-ball.png"
        >
          Using the latest in AI technology, Whimsera acts like a digital
          storyteller — taking your ideas and weaving them into unique
          adventures every time.
        </Section>

        {/* Who It’s For */}
        <Section
          direction="right"
          title="Who It’s For?"
          icon="/users-(1).png"
        >
          Whimsera is for everyone, no matter your age. Whether you&apos;re a child
          looking for a bedtime adventure, a teen exploring new worlds, or an
          adult rediscovering the magic of storytelling — our tales are written
          for dreamers of all ages.
        </Section>

        {/* Future Vision */}
        <Section
          direction="up"
          title="Future Vision"
          icon="/telescope.png"
        >
          We&apos;re just getting started. Soon, Whimsera will feature more powerful
          AI models, deeper story customization, and entirely new genres to
          explore. From choosing story length and writing style to shaping every
          detail of your adventure — endless storytelling possibilities await.
          And yes, mobile apps are on the horizon too!
        </Section>
      </div>

      <Footer />
    </main>
  );
}
