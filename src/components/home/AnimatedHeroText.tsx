"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

// Wrap with React.memo to prevent unnecessary re-renders if the parent component updates.
const AnimatedHeroText = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const title = containerRef.current?.querySelector(".hero-title");
      const subtitle = containerRef.current?.querySelector(".hero-subtitle");

      if (!title || !subtitle) return;

      // OPTIMIZATION 1: Animate words instead of characters. Much less work for the browser.
      const split = new SplitText(title, { type: "words" });

      const tl = gsap.timeline();

      tl.from(split.words, {
        y: 80,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
        // OPTIMIZATION 2: Force the animation onto the GPU layer.
        force3D: true,
      });

      tl.from(
        subtitle,
        {
          y: 20,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          // OPTIMIZATION 2: Also force the subtitle animation to the GPU.
          force3D: true,
        },
        "-=0.6" // Adjusted timing slightly for better flow with words
      );

      return () => {
        // Cleanup is still essential
        if (split.revert) {
          split.revert();
        }
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <h1 className="hero-title text-5xl md:text-7xl font-extrabold leading-tight">
        Your Voice, <span className="text-[#e50914]">Your Vote.</span>
        <br />
        Decide the Future.
      </h1>
      <p className="hero-subtitle text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
        Civic Cast provides a secure and transparent platform for digital
        elections. Register as a candidate or cast your vote with confidence.
      </p>
    </div>
  );
};

export default React.memo(AnimatedHeroText);
