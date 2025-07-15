"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { User, Election } from "@/types";
import { BarChart3 } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "next-auth/react";

// A component to display the results for a single candidate
function CandidateResult({
  candidate,
  totalVotes,
}: {
  candidate: User;
  totalVotes: number;
}) {
  const percentage =
    totalVotes > 0 ? ((candidate.voteCount || 0) / totalVotes) * 100 : 0;

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-1/3">
        <p className="font-medium text-white">{candidate.name}</p>
        <p className="text-xs text-gray-400">{candidate.electionPost}</p>
      </div>
      <div className="w-2/3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-300">
            {candidate.voteCount || 0} Votes
          </span>
          <span className="text-sm font-bold text-white">
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// The main page component for displaying election results
export default function ResultsPage() {
  const { data: session } = useSession();
  const adminId = session?.user?._id;
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<User[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!adminId) return;
    const fetchResultsData = async () => {
      try {
        const [electionsRes, usersRes] = await Promise.all([
          fetch(`/api/elections?adminId=${adminId}`),
          fetch("/api/users"),
        ]);

        if (!electionsRes.ok || !usersRes.ok) {
          throw new Error("Failed to fetch results data.");
        }

        const electionsData = await electionsRes.json();
        const usersData = await usersRes.json();

        setElections(electionsData);
        setCandidates(usersData.candidates);

        // Automatically select the first election if available
        if (electionsData.length > 0) {
          setSelectedElectionId(electionsData[0]._id);
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

    fetchResultsData();
  }, [adminId]);

  // Memoize the selected election and its results to avoid re-calculation on every render
  const selectedElectionResults = useMemo(() => {
    if (!selectedElectionId) return null;

    const election = elections.find((e) => e._id === selectedElectionId);
    if (!election) return null;

    return {
      ...election,
      posts: election.posts.map((post) => {
        const postCandidates = candidates.filter(
          (c) => c.electionPost === post.title
        );
        const totalVotes = postCandidates.reduce(
          (sum, c) => sum + (c.voteCount || 0),
          0
        );
        return {
          ...post,
          candidates: postCandidates.sort(
            (a, b) => (b.voteCount || 0) - (a.voteCount || 0)
          ), // Sort by highest votes
          totalVotes,
        };
      }),
    };
  }, [selectedElectionId, elections, candidates]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner text="Loading results..." />
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
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Election Results</h2>
          <p className="text-gray-400 mt-1">
            View the vote count for each election.
          </p>
        </div>
        <div>
          <select
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
            className="input-style"
            disabled={elections.length === 0}
          >
            {elections.length > 0 ? (
              elections.map((election) => (
                <option key={election._id} value={election._id}>
                  {election.title}
                </option>
              ))
            ) : (
              <option>No elections found</option>
            )}
          </select>
        </div>
      </div>

      {/* Results Display */}
      {selectedElectionResults ? (
        selectedElectionResults.posts.map((post) => (
          <div
            key={post.title}
            className="bg-[#181818] p-6 rounded-lg border border-gray-800"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-red-500" />
              Results for: {post.title}
            </h3>
            <div className="divide-y divide-gray-700">
              {post.candidates.length > 0 ? (
                post.candidates.map((candidate) => (
                  <CandidateResult
                    key={candidate._id}
                    candidate={candidate}
                    totalVotes={post.totalVotes}
                  />
                ))
              ) : (
                <p className="text-gray-500 py-4">
                  No candidates were registered for this post.
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-[#181818] p-10 rounded-lg border border-gray-800 text-center">
          <p className="text-gray-400">
            Please select an election to view the results.
          </p>
        </div>
      )}
    </div>
  );
}
