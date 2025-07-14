// app/admin/election-settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import type { Election } from "@/types";
import CreateElectionForm from "@/components/admin/CreateElectionForm";
import { ListChecks } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "next-auth/react";

export default function ElectionSettingsPage() {
  const { data: session } = useSession();
  const adminId = session?.user?._id;
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) return;
    const fetchElections = async () => {
      try {
        const res = await fetch(`/api/elections?adminId=${adminId}`);
        setElections(await res.json());
      } catch (error) {
        console.error("Failed to fetch elections", error);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, [adminId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner text="Loading Election Setting..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Election Settings</h2>
        <p className="text-gray-400 mt-1">
          Configure and manage all election events.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-[#181818] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            Create New Election
          </h3>
          <CreateElectionForm />
        </div>
        <div className="lg:col-span-2 bg-[#181818] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Election History
          </h3>
          <ul className="space-y-3">
            {elections.map((election) => (
              <li
                key={election._id}
                className="p-4 bg-[#101010] rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-white">{election.title}</p>
                  <p className="text-xs text-gray-400">
                    Ends: {new Date(election.endDate).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-1 bg-green-500/10 text-green-400 rounded">
                  {election.status || "Completed"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
