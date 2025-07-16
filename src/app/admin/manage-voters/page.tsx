"use client";

import React, { useState, useEffect } from "react";
import type { User } from "@/types";
import UserTable from "@/components/admin/UserTable";
import { Users } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

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
        let errorMessage = `An unexpected error occurred. : ${err}`;
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchVoters();
  }, []);

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
