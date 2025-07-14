"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2 } from "lucide-react"; // Import a loading icon

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // --- GSAP Animation Sequence ---
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Animate the main card container
      tl.from(".sign-up-card", {
        duration: 1.2,
        autoAlpha: 0,
        y: 100,
        scale: 0.95,
        ease: "power3.out",
      });

      // Staggered animation for the form elements
      tl.from(
        ".form-element",
        {
          duration: 0.8,
          autoAlpha: 0,
          y: 30,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.8" // Overlap with the previous animation for a smoother sequence
      );

      // Subtle animation for the background
      gsap.to(".background-glow", {
        duration: 10,
        scale: 1.5,
        opacity: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast.success("Account created successfully. Please sign in.");
      router.push("/signin");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white"
    >
      {/* Animated background element */}
      <div className="background-glow absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/20 opacity-20 blur-3xl"></div>

      {/* Navbar is removed for a focused experience */}
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="sign-up-card invisible w-full max-w-md space-y-8 rounded-2xl border border-gray-800 bg-[#181818]/80 p-10 shadow-2xl backdrop-blur-sm">
          <h2 className="form-element invisible text-center text-3xl font-extrabold tracking-tight text-white drop-shadow">
            Create Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-element invisible">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="bg-[#101010] border-gray-700 h-12 text-base"
              />
            </div>
            <div className="form-element invisible">
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="bg-[#101010] border-gray-700 h-12 text-base"
              />
            </div>
            <div className="form-element invisible">
              <Input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="bg-[#101010] border-gray-700 h-12 text-base"
              />
            </div>
            <div className="form-element invisible">
              <Button
                type="submit"
                className="group relative w-full overflow-hidden rounded-lg bg-[var(--primary-red)] py-3 text-lg font-bold text-white transition-all duration-300 hover:bg-[var(--hover-red)]"
                disabled={loading}
              >
                <div className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></div>
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </span>
              </Button>
            </div>
          </form>
          <div className="form-element invisible pt-2 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-bold text-[var(--primary-red)] underline-offset-4 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
