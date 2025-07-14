"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { Menu, X } from "lucide-react";

gsap.registerPlugin(useGSAP);

export default function Navbar() {
  const container = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#vote", label: "Vote Now" },
    { href: "/login", label: "Login / Register", isButton: true },
  ];

  // Animation for the desktop navbar links
  useGSAP(
    () => {
      gsap.fromTo(
        ".nav-link-desktop",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    },
    { scope: container }
  );

  // Animation for the mobile menu links
  useGSAP(
    () => {
      if (isMenuOpen) {
        gsap.fromTo(
          ".nav-link-mobile",
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }
    },
    { dependencies: [isMenuOpen] }
  );

  // Effect to lock body scroll when the menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  return (
    <header
      ref={container}
      className="relative z-50 flex items-center justify-between px-6 py-6 md:px-10"
    >
      {/* Logo */}
      <div className="logo">
        <Link
          href="/"
          className="nav-link-desktop text-2xl font-bold text-white"
        >
          Civic<span className="text-red-600">Cast</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-8 text-lg md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link-desktop transition-colors hover:text-red-500 ${
              link.isButton
                ? "group relative overflow-hidden rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition-all duration-300 hover:scale-105 hover:text-white"
                : ""
            }`}
          >
            <span className="relative z-10">{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          className="text-white"
        >
          <Menu size={30} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 flex h-screen w-full flex-col bg-[#080808]/95 backdrop-blur-lg md:hidden">
          {/* FIX: Header inside the mobile menu */}
          <div className="flex items-center justify-between border-b border-gray-800 p-6">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-bold text-white"
            >
              Civic<span className="text-red-600">Cast</span>
            </Link>
            {/* FIX: Explicit close button inside the menu */}
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="text-white"
            >
              <X size={30} />
            </button>
          </div>

          {/* Centered navigation links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-10 text-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link-mobile text-white ${
                  link.isButton
                    ? "rounded-lg bg-red-600 px-6 py-3 font-bold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
