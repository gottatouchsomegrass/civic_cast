"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Signed in successfully");
      router.push("/election");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md bg-[#181818] rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-800">
          <h2 className="text-3xl font-extrabold text-center mb-4 tracking-tight drop-shadow">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="text-center pt-2">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup">
                <Button variant="link" className="px-1 text-[var(--primary-red)] font-bold">
                  Register
                </Button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
