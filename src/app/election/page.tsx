"use client";

import React, { useEffect, useState } from "react";
import { Election, User } from "@/types";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";

interface Candidate extends User {
  profilePicture?: string;
}

type VotedMap = Record<string, boolean>; // key: `${electionId}_${post}`

export default function ElectionPage() {
  const { data: session } = useSession();
  const voterId = session?.user?._id;

  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voted, setVoted] = useState<VotedMap>({});
  const [voteLoading, setVoteLoading] = useState<string | null>(null); // key: `${electionId}_${post}`

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [electionsRes, usersRes] = await Promise.all([
          fetch("/api/elections"),
          fetch("/api/users"),
        ]);
        if (!electionsRes.ok || !usersRes.ok)
          throw new Error("Failed to fetch data");
        const electionsData = await electionsRes.json();
        const usersData = await usersRes.json();
        setElections(electionsData);
        setCandidates(usersData.candidates);
      } catch {
        setError("Failed to load elections or candidates.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // On election select, fetch user's votes for this election to disable buttons
  useEffect(() => {
    const fetchVotes = async () => {
      if (!voterId || !selectedElection) return;
      try {
        const res = await fetch(`/api/users`);
        if (!res.ok) return;
        const data = await res.json();
        const voter = data.voters?.find((v: User) => v._id === voterId);
        if (voter && Array.isArray(voter.votes)) {
          const votedMap: VotedMap = {};
          for (const v of voter.votes) {
            if (v.election === selectedElection._id) {
              votedMap[`${v.election}_${v.post}`] = true;
            }
          }
          setVoted(votedMap);
        }
      } catch {}
    };
    fetchVotes();
  }, [voterId, selectedElection]);

  const handleVote = async (
    candidateId: string,
    electionId: string,
    post: string
  ) => {
    if (!voterId) {
      toast.error("You must be signed in to vote.");
      return;
    }
    const voteKey = `${electionId}_${post}`;
    setVoteLoading(voteKey);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, candidateId, electionId, post }),
      });
      const data = await res.json();
      if (res.ok) {
        setVoted((prev) => ({ ...prev, [voteKey]: true }));
        toast.success("Vote cast successfully!");
      } else {
        if (res.status === 409) {
          setVoted((prev) => ({ ...prev, [voteKey]: true }));
          toast.error(data.message || "You have already voted for this post.");
        } else {
          toast.error(data.message || "Failed to cast vote.");
        }
      }
    } catch {
      toast.error("Failed to cast vote.");
    } finally {
      setVoteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--background-dark)]">
        <LoadingSpinner text="Loading elections..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--background-dark)]">
        <p className="text-[var(--primary-red)] text-lg font-semibold">
          {error}
        </p>
      </div>
    );
  }

  // Election options grid
  if (!selectedElection) {
    return (
      <div className="min-h-screen bg-[var(--background-dark)] text-[var(--text-light)]">
        <Navbar />
        <div className="px-4 pt-12">
          <h2 className="text-4xl font-extrabold text-center mb-12 tracking-tight text-[var(--text-light)] drop-shadow-lg">
            Elections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {elections.map((election) => (
              <button
                key={election._id}
                className="bg-[#181818] border-2 border-transparent rounded-2xl p-10 shadow-xl flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:border-[var(--primary-red)] group focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]"
                onClick={() => setSelectedElection(election)}
                style={{ minHeight: 180 }}
              >
                <span className="text-2xl font-bold mb-2 text-[var(--primary-red)] group-hover:text-[var(--hover-red)] transition-colors duration-200 drop-shadow">
                  {election.title}
                </span>
                <span className="text-gray-400 text-base text-center mt-2">
                  {election.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Posts and candidates for selected election
  return (
    <div className="min-h-screen bg-[var(--background-dark)] text-[var(--text-light)]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-12">
        <div className="mb-10 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedElection(null)}
            className="text-[var(--primary-red)] hover:text-[var(--hover-red)] font-semibold px-4 py-2 rounded-lg border border-[var(--primary-red)] bg-transparent"
          >
            ← Back to Elections
          </Button>
          <h2 className="text-3xl font-extrabold text-[var(--text-light)] ml-2 tracking-tight drop-shadow-lg">
            {selectedElection.title} Election Posts
          </h2>
        </div>
        {selectedElection.posts.length === 0 ? (
          <p className="text-gray-400">No posts found for this election.</p>
        ) : (
          <div className="space-y-12">
            {selectedElection.posts.map((post) => {
              const postCandidates = candidates.filter(
                (c) =>
                  c.election?.["_id"] === selectedElection._id &&
                  c.electionPost === post.title
              );
              const voteKey = `${selectedElection._id}_${post.title}`;
              const hasVoted = voted[voteKey];
              return (
                <div
                  key={post._id}
                  className="bg-[#181818] p-8 rounded-2xl border-2 border-gray-800 shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-[var(--primary-red)] mb-6 tracking-tight drop-shadow">
                    {post.title} Candidates
                  </h3>
                  {postCandidates.length === 0 ? (
                    <p className="text-gray-400">
                      No candidates registered for this post.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {postCandidates.map((candidate) => (
                        <div
                          key={candidate._id}
                          className="flex flex-col items-center bg-[#101010] rounded-xl p-6 border-2 border-gray-700 shadow-lg transition-all duration-200 hover:scale-105 hover:border-[var(--primary-red)] group"
                        >
                          <Image
                            src={candidate.profilePicture || "/file.svg"}
                            alt={candidate.name}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-[var(--primary-red)] group-hover:border-[var(--hover-red)] transition-colors duration-200 shadow"
                          />
                          <span className="text-[var(--text-light)] font-semibold text-lg mb-1 text-center drop-shadow">
                            {candidate.name}
                          </span>
                          <span className="text-gray-400 text-sm mb-3 text-center">
                            {candidate.email}
                          </span>
                          <Button
                            disabled={hasVoted || voteLoading === voteKey}
                            onClick={() =>
                              handleVote(
                                candidate._id,
                                selectedElection._id,
                                post.title
                              )
                            }
                            className={`w-full mt-2 font-bold rounded-lg px-4 py-2 transition-all duration-200 ${
                              hasVoted
                                ? "bg-gray-700 text-gray-400"
                                : "bg-[var(--primary-red)] text-white hover:bg-[var(--hover-red)]"
                            }`}
                          >
                            {voteLoading === voteKey
                              ? "Voting..."
                              : hasVoted
                              ? "Voted"
                              : "Vote"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
