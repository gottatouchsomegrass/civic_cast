"use client";

import React, { useState, useEffect } from "react";
import type { User } from "@/types";
import UserTable from "@/components/admin/UserTable";
import { UserPlus } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "next-auth/react";

// A dedicated form for registering a new voter
function RegisterVoterForm({
  onVoterAdded,
}: {
  onVoterAdded: (newUser: User) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // This API endpoint is for general user registration, which defaults to 'voter'
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Voter ${name} registered successfully!`);
        onVoterAdded(data);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.message || "Failed to register voter.");
      }
    } catch (err) {
      console.error("An operation failed:", err);

      let errorMessage = "An unexpected error occurred.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input-style"
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="input-style"
      />
      <input
        type="password"
        placeholder="Set a Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="input-style"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-800"
      >
        {loading ? "Registering..." : "Register Voter"}
      </button>

      {message && (
        <p className="text-center text-green-500 text-sm mt-2">{message}</p>
      )}
      {error && (
        <p className="text-center text-red-500 text-sm mt-2">{error}</p>
      )}
    </form>
  );
}

// The main page component for managing voters
export default function ManageVotersPage() {
  const { data: session } = useSession();
  const adminId = session?.user?._id;
  const [voters, setVoters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial list of voters
  useEffect(() => {
    if (!adminId) return;
    const fetchVoters = async () => {
      try {
        const res = await fetch(`/api/users/by-admin?adminId=${adminId}`);
        if (!res.ok) throw new Error("Could not fetch voter data.");
        const data = await res.json();
        setVoters(data.voters);
      } catch (err) {
        console.error("An operation failed:", err);

        let errorMessage = "An unexpected error occurred.";

        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchVoters();
  }, [adminId]);

  // Callback to add a new voter to the list without a full page reload
  const handleVoterAdded = (newVoter: User) => {
    setVoters((prev) => [newVoter, ...prev]);
  };

  // Function to delete a voter
  const handleDeleteVoter = async (id: string) => {
    if (confirm("Are you sure you want to remove this voter?")) {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVoters((prev) => prev.filter((v) => v._id !== id));
      } else {
        alert("Failed to delete voter.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner text="Loading Voters..." />
      </div>
    );
  }
  if (error)
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Manage Voters</h2>
        <p className="text-gray-400 mt-1">
          View registered voters who have participated in your elections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area for the voters table */}
        <div className="lg:col-span-2 bg-[#181818] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            Registered Voters List
          </h3>
          <UserTable users={voters} onDelete={handleDeleteVoter} />
        </div>
      </div>
    </div>
  );
}
