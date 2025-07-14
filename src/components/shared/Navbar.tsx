"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

gsap.registerPlugin(useGSAP);

export default function Navbar() {
  const container = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  const navLinks = [{ href: "/election", label: "Vote Now", isButton: false }];

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

  // GSAP animation for mobile menu links
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
      // FIX: The background, border, and shadow are removed for a clean, transparent look.
      className="relative z-50 flex items-center justify-between px-6 py-6 md:px-10 crazy-nav"
    >
      {/* Logo */}
      <div className="logo">
        <Link
          href="/"
          className="nav-link-desktop text-2xl font-extrabold tracking-tight text-[var(--text-light)] drop-shadow"
        >
          Civic<span className="text-[var(--primary-red)]">Cast</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-8 text-lg md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="nav-link-desktop font-semibold text-white transition-colors hover:text-[var(--primary-red)]"
          >
            {link.label}
          </Link>
        ))}
        {isSignedIn ? (
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="group nav-link-desktop relative inline-block rounded-lg border-2 border-gray-700 px-4 py-2 font-bold text-white transition-all duration-300 hover:border-red-600"
          >
            <span className="absolute top-0 left-0 h-full w-full scale-x-0 bg-red-600/20 transition-transform duration-300 group-hover:scale-x-100"></span>
            <span className="relative z-10 flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Sign Out
            </span>
          </button>
        ) : (
          <Link
            href="/signin"
            className="group nav-link-desktop relative inline-block rounded-lg border-2 border-gray-700 px-4 py-2 font-bold text-white transition-all duration-300 hover:border-red-600"
          >
            <span className="absolute top-0 left-0 h-full w-full scale-x-0 bg-red-600/20 transition-transform duration-300 group-hover:scale-x-100"></span>
            <span className="relative z-10">Sign In / Register</span>
          </Link>
        )}
      </nav>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          className="text-[var(--text-light)]"
        >
          <Menu size={30} />
        </button>
      </div>

      {/* Mobile Menu Overlay (retains its background for readability) */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 z-50 flex h-screen w-full flex-col bg-[#080808]/95 backdrop-blur-lg md:hidden">
          <div className="flex items-center justify-between border-b border-gray-800 p-6">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-extrabold tracking-tight text-[var(--text-light)] drop-shadow"
            >
              Civic<span className="text-[var(--primary-red)]">Cast</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="text-[var(--text-light)]"
            >
              <X size={30} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-10 text-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="nav-link-mobile font-semibold text-white"
              >
                {link.label}
              </Link>
            ))}
            {isSignedIn ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/signin" });
                }}
                className="group nav-link-mobile relative mt-6 inline-block rounded-lg border-2 border-gray-700 px-6 py-3 font-bold text-white"
              >
                <span className="absolute top-0 left-0 h-full w-full scale-x-0 bg-red-600/20 transition-transform duration-300 group-hover:scale-x-100"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </span>
              </button>
            ) : (
              <Link
                href="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="group nav-link-mobile relative mt-6 inline-block rounded-lg border-2 border-gray-700 px-6 py-3 font-bold text-white"
              >
                <span className="absolute top-0 left-0 h-full w-full scale-x-0 bg-red-600/20 transition-transform duration-300 group-hover:scale-x-100"></span>
                <span className="relative z-10">Sign In / Register</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
