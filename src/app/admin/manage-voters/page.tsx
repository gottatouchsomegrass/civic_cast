"use client";

import React, { useState, useEffect } from "react";
import type { User } from "@/types";
import UserTable from "@/components/admin/UserTable";
import { UserPlus, Users } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Voter ${name} registered successfully!`);
        onVoterAdded(data.user);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(data.message || "Failed to register voter.");
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred.";
      if (err instanceof Error) errorMessage = err.message;
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

export default function ManageVotersPage() {
  const [voters, setVoters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const res = await fetch("/api/users/by-admin");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "Could not fetch participant data."
          );
        }

        const data: User[] = await res.json();
        setVoters(data);
      } catch (err) {
        let errorMessage = "An unexpected error occurred.";
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchVoters();
  }, []);

  const handleVoterAdded = (newVoter: User) => {
    console.log(
      "New voter registered. They will appear in the main list after voting.",
      newVoter
    );
  };

  const handleDeleteVoter = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to remove this user? This action is permanent."
      )
    ) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (res.ok) {
          setVoters((prev) => prev.filter((v) => v._id !== id));
        } else {
          const errorData = await res.json();
          alert(`Failed to delete user: ${errorData.message}`);
        }
      } catch (err) {
        alert("An error occurred while trying to delete the user.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner text="Loading Participants..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Election Participants</h2>
        <p className="text-gray-400 mt-1">
          View all users who have voted in elections you created.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 bg-[#181818] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Voter Participation List
          </h3>
          {voters.length > 0 ? (
            <UserTable users={voters} onDelete={handleDeleteVoter} />
          ) : (
            <p className="text-gray-400 text-center py-8">
              No users have participated in your elections yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
