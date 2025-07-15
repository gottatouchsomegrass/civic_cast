"use client";

import React, { useState, useEffect } from "react";
import UserTable from "@/components/admin/UserTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "next-auth/react";

// The main page component for managing voters
export default function ManageVotersPage() {
  const { data: session } = useSession();
  const adminId = session?.user?._id;
  const [voters, setVoters] = useState([]);
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

      <div className="bg-[#181818] p-6 rounded-lg border border-gray-800 w-full max-w-none">
        <h3 className="text-lg font-semibold text-white mb-4">
          Registered Voters List
        </h3>
        <UserTable users={voters} />
      </div>
    </div>
  );
}
