"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React from "react";

export default function ScrollIndicator() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { y: 0, opacity: 1 },
      {
        y: 20,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white z-20"
    >
      <p className="text-sm tracking-widest uppercase">Scroll to Explore</p>
      <div className="mt-2 text-2xl">↓</div>
    </div>
  );
}
