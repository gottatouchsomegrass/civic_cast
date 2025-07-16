"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface AuthButtonProps {
  className?: string;
}

export default function AuthButton({ className }: AuthButtonProps) {
  // 1. Destructure the `status` property from useSession
  const { data: session, status } = useSession();

  // 2. CRITICAL FIX: While the session is being checked, render a placeholder.
  // This prevents the "Sign In" button from ever showing for a logged-in user.
  if (status === "loading") {
    // This skeleton loader has the same size as the button to prevent layout shift.
    return (
      <div
        className={`h-10 w-36 animate-pulse rounded-lg bg-gray-800 ${className}`}
      />
    );
  }

  // 3. Once the status is 'authenticated', show the Sign Out button.
  if (status === "authenticated") {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-lg border-2 border-gray-700 font-bold text-white transition-all duration-300 hover:border-red-600 ${className}`}
      >
        <span className="absolute h-full w-full scale-x-0 bg-red-600/20 transition-transform duration-300 group-hover:scale-x-100"></span>
        <span className="relative z-10 flex items-center gap-2">
          <LogOut className="h-5 w-5" />
          Sign Out
        </span>
      </button>
    );
  }

  // 4. If the status is 'unauthenticated', show the Sign In button.
  return (
    <Link
      href="/signin"
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-lg border-2 border-gray-700 font-bold text-white transition-all duration-300 hover:border-red-600 ${className}`}
    >
      <span className="absolute h-full w-full scale-x-0 bg-red-600/20 transition-transform duration-300 group-hover:scale-x-100"></span>
      <span className="relative z-10">Sign In / Register</span>
    </Link>
  );
}
