// app/admin/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminSignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Redirect to the sign-in page on successful registration
        router.push("/admin/signin");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create admin account.");
      }
    } catch (err) {
      setError(`An unexpected error occurred. Please try again. : ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#121212] rounded-lg shadow-lg border border-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Create Admin Account
          </h1>
          <p className="mt-2 text-gray-400">
            Set up your administrative credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- Form Fields Start Here --- */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* --- Form Fields End Here --- */}

          {error && (
            <p className="text-red-500 text-sm text-center pt-2">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center mt-4 px-4 py-2 text-lg font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating Account..." : "Create Admin"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an admin account?{" "}
          <Link
            href="/admin/signin"
            className="font-medium text-red-500 hover:underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
