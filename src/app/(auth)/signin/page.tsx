"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.role) {
      toast.error("Please select a role.");
      return;
    }
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      role: form.role,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Signed in successfully");
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">
            Sign <span className="text-[#e50914]">In</span>
          </h2>
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div className="w-full">
            <Select
              value={form.role || ""}
              onValueChange={(value) => setForm({ ...form, role: value })}
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voter">Voter</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup">
              <Button
                variant="link"
                className="px-1 text-primary hover:text-red-600"
              >
                Sign Up
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
