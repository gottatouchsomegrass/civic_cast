// app/components/BackToTopButton.tsx
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useState, useEffect } from "react";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useGSAP(() => {
    gsap.to(buttonRef.current, {
      autoAlpha: isVisible ? 1 : 0,
      scale: isVisible ? 1 : 0.5,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isVisible]);

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#e50914] text-white shadow-lg hover:bg-[#f40612] transition-colors"
      style={{ visibility: "hidden" }}
      aria-label="Go to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7" />
      </svg>
    </button>
  );
}
