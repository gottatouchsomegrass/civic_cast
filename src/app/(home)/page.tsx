// app/(home)/page.tsx
"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import VoterIdCard from "@/components/home/VoterCard";
import VotingStory from "@/components/home/VotingStory";
import ScrollIndicator from "@/components/home/ScrollIndicator";
import Footer from "@/components/shared/Footer";
import BackToTopButton from "@/components/home/BackToTopButton";
import AnimatedHeroText from "@/components/home/AnimatedHeroText"; // <-- Import the new component

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="relative container mx-auto px-6 text-center mt-12 pb-20">
          {/* --- Replace static text with the animated component --- */}
          <AnimatedHeroText />

          <VoterIdCard />
          <ScrollIndicator />
        </div>

        {/* Scrollytelling Section */}
        <VotingStory />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
}
