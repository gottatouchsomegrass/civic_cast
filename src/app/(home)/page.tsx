"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import VoterIdCard from "@/components/home/VoterCard";
import VotingStory from "@/components/home/VotingStory";
import ScrollIndicator from "@/components/home/ScrollIndicator";
import Footer from "@/components/shared/Footer";
import BackToTopButton from "@/components/home/BackToTopButton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main>
        {/* Hero Section */}
        <div className="relative container mx-auto px-6 text-center mt-12 pb-20">
          <h1 className="hero-title text-5xl md:text-7xl font-extrabold leading-tight">
            Your Voice, <span className="text-[#e50914]">Your Vote.</span>
            <br />
            Decide the Future.
          </h1>
          <p className="hero-subtitle text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            Civic Cast provides a secure and transparent platform for digital
            elections. Register as a candidate or cast your vote with
            confidence.
          </p>
          <VoterIdCard />
          <ScrollIndicator /> {/* Indicator to prompt scrolling */}
        </div>

        {/* Scrollytelling Section */}
        <VotingStory />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
}
