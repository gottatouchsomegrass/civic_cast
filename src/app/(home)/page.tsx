"use client";

import React from "react";
import dynamic from "next/dynamic";

import Navbar from "@/components/shared/Navbar";

import VotingStory from "@/components/home/VotingStory";
import ScrollIndicator from "@/components/home/ScrollIndicator";
import Footer from "@/components/shared/Footer";
import BackToTopButton from "@/components/home/BackToTopButton";

const AnimatedHeroText = dynamic(
  () => import("@/components/home/AnimatedHeroText"),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: "260px" }} />,
  }
);

const VoterIdCard = dynamic(() => import("@/components/home/VoterCard"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "400px", width: "100%" }} />,
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main>
        <div className="relative container mx-auto px-6 text-center mt-12 pb-20">
          <AnimatedHeroText />

          <VoterIdCard />
          <ScrollIndicator />
        </div>

        <VotingStory />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
}
