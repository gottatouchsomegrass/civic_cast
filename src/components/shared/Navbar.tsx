"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

gsap.registerPlugin(useGSAP);

export default function Navbar() {
  const container = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;

  // Only show login/register if not signed in
  const navLinks = isSignedIn
    ? []
    : [
        { href: "/signin", label: "Sign In / Register", isButton: true },
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
      className="relative z-50 flex items-center justify-between px-6 py-6 md:px-10 bg-[var(--background-dark)] border-b border-gray-800 shadow"
    >
      {/* Logo */}
      <div className="logo">
        <Link
          href="/"
          className="nav-link-desktop text-2xl font-extrabold text-[var(--text-light)] tracking-tight drop-shadow"
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
            className={`nav-link-desktop transition-colors hover:text-[var(--primary-red)] ${
              link.isButton
                ? "group relative overflow-hidden rounded-lg bg-[var(--primary-red)] px-4 py-2 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[var(--hover-red)]"
                : ""
            }`}
          >
            <span className="relative z-10">{link.label}</span>
          </Link>
        ))}
        {/* Sign Out button for signed-in users */}
        {isSignedIn && (
          <Button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="ml-4 flex items-center gap-2 bg-[var(--primary-red)] hover:bg-[var(--hover-red)] text-white font-bold px-4 py-2 rounded-lg shadow transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 flex h-screen w-full flex-col bg-[#080808]/95 backdrop-blur-lg md:hidden z-50">
          {/* Header inside the mobile menu */}
          <div className="flex items-center justify-between border-b border-gray-800 p-6">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-extrabold text-[var(--text-light)] tracking-tight drop-shadow"
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
          {/* Centered navigation links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-10 text-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link-mobile text-[var(--text-light)] ${
                  link.isButton
                    ? "rounded-lg bg-[var(--primary-red)] px-6 py-3 font-bold hover:bg-[var(--hover-red)]"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Sign Out button for signed-in users (mobile) */}
            {isSignedIn && (
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/signin" });
                }}
                className="flex items-center gap-2 bg-[var(--primary-red)] hover:bg-[var(--hover-red)] text-white font-bold px-6 py-3 rounded-lg shadow transition-all duration-200 mt-6"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
