"use client";

import React, { useEffect, useState } from "react";
import { Election, User } from "@/types";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";

interface Candidate extends User {
  profilePicture?: string;
}

type VotedMap = Record<string, boolean>; // key: `${electionId}_${post}`

export default function ElectionPage() {
  const { data: session } = useSession();
  const voterId = session?.user?._id;

  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
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
        if (!electionsRes.ok || !usersRes.ok) throw new Error("Failed to fetch data");
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

  const handleVote = async (candidateId: string, electionId: string, post: string) => {
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
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner text="Loading elections..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Election options grid
  if (!selectedElection) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Elections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {elections.map((election) => (
            <button
              key={election._id}
              className="bg-[#181818] border border-gray-800 rounded-lg p-8 shadow-lg flex flex-col items-center hover:bg-red-900/20 transition-colors"
              onClick={() => setSelectedElection(election)}
            >
              <span className="text-xl font-semibold text-white mb-2">{election.title}</span>
              <span className="text-gray-400 text-sm text-center">{election.description}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Posts and candidates for selected election
  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" onClick={() => setSelectedElection(null)}>
          ← Back to Elections
        </Button>
        <h2 className="text-2xl font-bold text-white">{selectedElection.title} Election Posts</h2>
      </div>
      {selectedElection.posts.length === 0 ? (
        <p className="text-gray-400">No posts found for this election.</p>
      ) : (
        <div className="space-y-10">
          {selectedElection.posts.map((post) => {
            const postCandidates = candidates.filter(
              (c) => c.election?.['_id'] === selectedElection._id && c.electionPost === post.title
            );
            const voteKey = `${selectedElection._id}_${post.title}`;
            const hasVoted = voted[voteKey];
            return (
              <div key={post._id} className="bg-[#181818] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {post.title} Candidates
                </h3>
                {postCandidates.length === 0 ? (
                  <p className="text-gray-400">No candidates registered for this post.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {postCandidates.map((candidate) => (
                      <div
                        key={candidate._id}
                        className="flex flex-col items-center bg-[#101010] rounded-lg p-4 border border-gray-700 shadow"
                      >
                        <Image
                          src={candidate.profilePicture || "/file.svg"}
                          alt={candidate.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-red-600"
                        />
                        <span className="text-white font-medium text-lg mb-1">{candidate.name}</span>
                        <span className="text-gray-400 text-sm mb-3">{candidate.email}</span>
                        <Button
                          disabled={hasVoted || voteLoading === voteKey}
                          onClick={() => handleVote(candidate._id, selectedElection._id, post.title)}
                        >
                          {voteLoading === voteKey ? "Voting..." : hasVoted ? "Voted" : "Vote"}
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
  );
}
