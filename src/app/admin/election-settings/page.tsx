"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Election } from "@/types";
import CreateElectionForm from "@/components/admin/CreateElectionForm";
import { ListChecks, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function ElectionSettingsPage() {
  const { data: session, status } = useSession();

  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState<string | null>(null);

  const fetchElections = useCallback(async () => {
    try {
      const res = await fetch(`/api/elections`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch elections");
      }

      setElections(await res.json());
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not load election history.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchElections();
    }
    if (status === "unauthenticated") {
      setElections([]);
      setLoading(false);
    }
  }, [status, fetchElections]);

  const handleDeleteClick = (id: string) => {
    setElectionToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!electionToDelete) return;

    try {
      const res = await fetch(`/api/elections/${electionToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete election.");
      }

      toast.success("Election deleted successfully.");
      await fetchElections();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not delete election.");
      }
    } finally {
      setIsModalOpen(false);
      setElectionToDelete(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner text="Verifying access..." />
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user.role !== "admin") {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p className="text-gray-400">
          You must be an administrator to view this page.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Election Settings</h2>
          <p className="text-gray-400 mt-1">
            Configure and manage all election events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-[#181818] p-6 rounded-lg border border-gray-800 self-start">
            <h3 className="text-lg font-semibold text-white mb-4">
              Create New Election
            </h3>
            <CreateElectionForm onSuccess={fetchElections} />
          </div>
          <div className="lg:col-span-2 bg-[#181818] p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Election History
            </h3>
            <ul className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-10">
                  <LoadingSpinner text="Loading history..." />
                </div>
              ) : elections.length > 0 ? (
                elections.map((election) => (
                  <li
                    key={election._id}
                    className="p-4 bg-[#101010] rounded-md flex justify-between items-center group"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {election.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        Ends: {new Date(election.endDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono px-2 py-1 bg-green-500/10 text-green-400 rounded">
                        {election.status || "Scheduled"}
                      </span>
                      <button
                        onClick={() => handleDeleteClick(election._id)}
                        className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Election"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No elections have been created yet.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Election"
        message="Are you sure you want to permanently delete this election? This action cannot be undone."
      />
    </>
  );
}
