"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";

gsap.registerPlugin(useGSAP);

export default function Navbar() {
  const container = useRef(null);

  useGSAP(
    () => {
      // FIX: Use fromTo for a more reliable animation
      gsap.fromTo(
        ".nav-link",
        { y: -30, opacity: 0 }, // Starting state
        {
          y: 0,
          opacity: 1, // Explicitly set the final state
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    },
    { scope: container } // Ensure 'container' ref is correctly assigned to the navbar element
  );

  return (
    <header
      ref={container}
      className="py-6 px-10 flex justify-between items-center crazy-nav"
    >
      <div className="logo">
        <Link href="/" className="text-2xl font-bold text-white nav-link">
          Civic<span className="text-red-600">Cast</span>
        </Link>
      </div>
      <nav className="flex gap-8 items-center text-lg">
        <Link href="#vote" className="nav-link">
          Vote Now
        </Link>

        <Link
          href="/login"
          // Add: relative, group, overflow-hidden
          // Remove: bg-red-600, transition-colors
          className="relative group nav-link overflow-hidden hover:scale-105 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
          id="login"
        >
          {/* The span ensures text is on a higher layer than the animation */}
          <span className="relative z-10">Login / Register</span>
        </Link>
      </nav>
    </header>
  );
}
