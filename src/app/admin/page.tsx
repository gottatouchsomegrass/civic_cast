// app/admin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import DashboardCard from "@/components/admin/DashboardCard";
import UserTable from "@/components/admin/UserTable";
import CountdownTimer from "@/components/admin/CountdownTimer"; // FIX: Corrected import path
import CreateElectionForm from "@/components/admin/CreateElectionForm";
import type { User, Election } from "@/types"; // FIX: Using the single source of truth for types

// The local User interface was removed as it was redundant and incorrect.

export default function AdminDashboardPage() {
  const [voters, setVoters] = useState<User[]>([]);
  const [candidates, setCandidates] = useState<User[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // FIX: Added error state for better UX

  // FIX: Fetch all data concurrently and handle loading state correctly
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, electionsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/elections"),
        ]);

        if (!usersRes.ok || !electionsRes.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const usersData = await usersRes.json();
        const electionsData = await electionsRes.json();

        setVoters(usersData.voters);
        setCandidates(usersData.candidates);
        setElections(electionsData);
      } catch (err) {
        setError(
          "Could not load dashboard data. Please try refreshing the page."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleDeleteUser = async (id: string, role: "voter" | "candidate") => {
    if (confirm("Are you sure you want to remove this user?")) {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (role === "voter") {
        setVoters((prev) => prev.filter((user) => user._id !== id));
      } else {
        setCandidates((prev) => prev.filter((user) => user._id !== id));
      }
    }
  };

  if (loading)
    return (
      <p className="text-center text-lg text-gray-400">Loading Dashboard...</p>
    );
  if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

  // Get the most recent election to display its status
  const activeElection = elections[0];

  return (
    <div className="space-y-8">
      {/* FIX: Added a dynamic election status card */}
      {activeElection && (
        <DashboardCard title="Active Election Status">
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-300">{activeElection.title}</p>
            <div className="text-xl font-mono bg-gray-800 p-2 px-4 rounded-md">
              <CountdownTimer endDate={activeElection.endDate} />
            </div>
          </div>
        </DashboardCard>
      )}

      <DashboardCard title="Create New Election">
        <CreateElectionForm />
      </DashboardCard>

      <DashboardCard title="Existing Elections">
        <ul className="space-y-3">
          {elections.map((election) => (
            <li
              key={election._id}
              className="p-3 bg-gray-800/50 rounded-md flex justify-between items-center"
            >
              <span className="font-semibold">{election.title}</span>
              <span className="text-sm text-gray-400">
                Ends: {new Date(election.endDate).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </DashboardCard>

      <DashboardCard title="Manage Candidates">
        <UserTable
          users={candidates}
          onDelete={(id) => handleDeleteUser(id, "candidate")}
        />
      </DashboardCard>

      <DashboardCard title="Manage Voters">
        <UserTable
          users={voters}
          onDelete={(id) => handleDeleteUser(id, "voter")}
        />
      </DashboardCard>
    </div>
  );
}
