"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function LoadingSpinner({
  size = "h-16 w-16",
  text = "Loading...",
}: {
  size?: string;
  text?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".spinner", {
        rotation: 360,
        duration: 1.2,
        ease: "power1.inOut", // A smoother ease than linear
        repeat: -1, // Repeat indefinitely
      });

      gsap.to(".loading-text", {
        opacity: 0.5,
        duration: 0.8,
        yoyo: true, // Animate back and forth
        repeat: -1,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef } // Scope the animations to this component
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center gap-4"
    >
      <div
        className={`spinner ${size} rounded-full border-4 border-solid border-red-500 border-t-transparent`}
      ></div>

      {text && <p className="loading-text text-lg text-gray-400">{text}</p>}
    </div>
  );
}
