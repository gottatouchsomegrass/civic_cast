"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".sign-in-card", {
        duration: 1.2,
        autoAlpha: 0,
        y: 100,
        scale: 0.95,
        ease: "power3.out",
      });

      tl.from(
        ".form-element",
        {
          duration: 0.8,
          autoAlpha: 0,
          y: 30,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.8"
      );

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

    const res = await signIn("credentials", {
      callbackUrl: "/election",
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Signed in successfully!");
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white"
    >
      <div className="background-glow absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/20 opacity-20 blur-3xl"></div>

      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="sign-in-card invisible w-full max-w-md space-y-8 rounded-2xl border border-gray-800 bg-[#181818]/80 p-10 shadow-2xl backdrop-blur-sm">
          <h2 className="form-element invisible text-center text-3xl font-extrabold tracking-tight text-white drop-shadow">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </Button>
            </div>
          </form>
          <div className="form-element invisible pt-2 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[var(--primary-red)] underline-offset-4 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
