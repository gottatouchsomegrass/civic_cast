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
      gsap.from(".nav-link", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: container }
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
        <Link href="#features" className="nav-link">
          Features
        </Link>
        <Link href="#vote" className="nav-link">
          Vote Now
        </Link>
        <Link
          href="/login"
          className="nav-link bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Login / Register
        </Link>
      </nav>
    </header>
  );
}
