// app/components/home/AnimatedHeroText.tsx
"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AnimatedHeroText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const title = containerRef.current?.querySelector(".hero-title");
      const subtitle = containerRef.current?.querySelector(".hero-subtitle");

      if (!title || !subtitle) return;

      // This function correctly splits the title while preserving its HTML structure
      const splitTextAndKeepStructure = (element: Element): HTMLElement[] => {
        const chars: HTMLElement[] = [];
        const nodes = Array.from(element.childNodes);

        nodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || "";
            const fragment = document.createDocumentFragment();
            text.split("").forEach((char) => {
              const span = document.createElement("span");
              span.textContent = char;
              if (char.trim() !== "") {
                span.style.display = "inline-block";
              }
              fragment.appendChild(span);
              chars.push(span);
            });
            node.parentNode?.replaceChild(fragment, node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            if ((node as Element).childNodes.length > 0) {
              chars.push(...splitTextAndKeepStructure(node as Element));
            }
          }
        });
        return chars;
      };

      const titleChars = splitTextAndKeepStructure(title);

      // --- FIX: Create a GSAP timeline for sequential animation ---
      const tl = gsap.timeline();

      // 1. Animate the title with the character-by-character effect
      tl.from(titleChars, {
        y: 80,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: "power3.out",
      });

      // 2. Animate the subtitle as a single block for a slow, simple appearance
      // This automatically fixes the "lost spaces" issue because we are not splitting its text.
      tl.from(
        subtitle,
        {
          y: 20, // A subtle upward slide
          opacity: 0, // Fade in from invisible
          duration: 1.2, // A longer duration for a "slow" feel
          ease: "power2.out",
        },
        "-=0.4"
      ); // Overlap slightly with the end of the title animation for a fluid transition
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
      {/* The subtitle's HTML is now left untouched, preserving all spaces */}
      <p className="hero-subtitle text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
        Civic Cast provides a secure and transparent platform for digital
        elections. Register as a candidate or cast your vote with confidence.
      </p>
    </div>
  );
}
