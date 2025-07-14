"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";

export default function SignOutPage() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    setLoading(true);
    toast.info("Signing you out...");
    signOut({ callbackUrl: "/signin" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md bg-[#181818] rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-800 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold mb-2 text-center tracking-tight drop-shadow">Ready to Sign Out?</h1>
          <p className="text-gray-400 mb-6 text-center">
            Click below to securely end your session.
          </p>
          <Button onClick={handleSignOut} disabled={loading} className="w-full font-bold bg-[var(--primary-red)] hover:bg-[var(--hover-red)] text-white rounded-lg py-3 text-lg flex items-center justify-center">
            <LogOut className="w-5 h-5 mr-2" />
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
