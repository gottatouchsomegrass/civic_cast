"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

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
      toast.success("Account created. Please sign in.");
      router.push("/signin");
    } catch (err) {
      console.error("An operation failed:", err);

      let errorMessage = "An unexpected error occurred.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md bg-[#181818] rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-800">
          <h2 className="text-3xl font-extrabold text-center mb-4 tracking-tight drop-shadow">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="bg-[#101010] border border-gray-700 text-white"
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="bg-[#101010] border border-gray-700 text-white"
            />
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="bg-[#101010] border border-gray-700 text-white"
            />
            <Button type="submit" className="w-full font-bold bg-[var(--primary-red)] hover:bg-[var(--hover-red)] text-white rounded-lg py-3 text-lg" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
          <div className="text-center pt-2">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/signin">
                <Button variant="link" className="px-1 text-[var(--primary-red)] font-bold">
                  Sign In
                </Button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
