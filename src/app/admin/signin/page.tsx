"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminSignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Both email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push("/admin");
      } else {
        setError(result?.error || "Invalid email or password.");
      }
    } catch (err) {
      setError(`An unexpected error occurred. Please try again. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center lg:-ml-64 min-h-screen bg-[#0a0a0a]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#121212] rounded-lg shadow-lg border border-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="mt-2 text-gray-400">Sign in to manage the election.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- Form Fields Start Here --- */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center pt-2">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center mt-4 px-4 py-2 text-lg font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400">
          Need an admin account? contact Pyro and Dipankar for it.
        </p>
      </div>
    </div>
  );
}
