"use client";

import React, { useEffect, useState, useRef } from "react";
import { Election, User } from "@/types";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { ArrowLeft, Check, Loader2, Users, Circle } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import CandidateVoteCard from "@/components/election/CandidateCard";

const getElectionStatus = (startDate: Date, endDate: Date) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return { text: "Upcoming", color: "text-blue-400" };
  if (now > end) return { text: "Completed", color: "text-gray-500" };
  return { text: "Ongoing", color: "text-green-400" };
};

export default function ElectionPage() {
  const { data: session } = useSession();
  const voterId = session?.user?._id;

  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<User[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVotesForElection, setUserVotesForElection] = useState<
    Record<string, boolean>
  >({});
  const [voteLoading, setVoteLoading] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const mainContainer = useRef(null);
  const electionGridRef = useRef(null);
  const postsViewRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const maxRetries = 3;
      const retryDelay = 500;

      for (let i = 0; i <= maxRetries; i++) {
        try {
          const [electionsRes, usersRes] = await Promise.all([
            fetch("/api/elections"),
            fetch("/api/users"),
          ]);

          if (!electionsRes.ok || !usersRes.ok)
            throw new Error("Failed to fetch essential data.");

          setElections(await electionsRes.json());
          setCandidates((await usersRes.json()).candidates || []);

          break; // exit the loop if the requests are successful
        } catch (error) {
          if (i < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          } else {
            setError(`Failed to load election data. ${error}`);
          }
        }
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedElection || !voterId) {
      setUserVotesForElection({});
      return;
    }
    const fetchVotes = async () => {
      try {
        const res = await fetch("/api/vote/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voterId, electionId: selectedElection._id }),
        });
        if (res.ok) setUserVotesForElection(await res.json());
      } catch (e) {
        console.error("Could not fetch user's votes:", e);
      }
    };
    fetchVotes();
  }, [selectedElection, voterId]);

  useGSAP(
    () => {
      if (loading) return;
      if (!selectedElection) {
        gsap.to(electionGridRef.current, { autoAlpha: 1, duration: 0.4 });
        gsap.from(".election-card-container", {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        });
      } else {
        gsap.to(postsViewRef.current, { autoAlpha: 1, duration: 0.4 });
        gsap.from(".post-card", {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
        });
      }
    },
    { scope: mainContainer, dependencies: [selectedElection, loading] }
  );

  const handleSelectElection = (election: Election) =>
    gsap.to(electionGridRef.current, {
      autoAlpha: 0,
      y: -40,
      duration: 0.4,
      ease: "power3.in",
      onComplete: () => setSelectedElection(election),
    });
  const handleGoBack = () =>
    gsap.to(postsViewRef.current, {
      autoAlpha: 0,
      y: 40,
      duration: 0.4,
      ease: "power3.in",
      onComplete: () => setSelectedElection(null),
    });

  const handleVote = async (
    candidateId: string,
    electionId: string,
    post: string
  ) => {
    if (!voterId) return toast.error("You must be signed in to vote.");
    setVoteLoading(post);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, candidateId, electionId, post }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserVotesForElection((prev) => ({ ...prev, [post]: true }));
        toast.success("Vote cast successfully!");
        setShowConfetti(true);
      } else {
        if (res.status === 409)
          setUserVotesForElection((prev) => ({ ...prev, [post]: true }));
        toast.error(data.message || "Failed to cast vote.");
      }
    } catch {
      toast.error("An error occurred while casting your vote.");
    } finally {
      setVoteLoading(null);
    }
  };

  const renderContent = () => {
    if (loading)
      return (
        <div className="flex flex-col h-[80vh] w-full items-center justify-center text-white">
          <Loader2 className="h-8 w-8 animate-spin text-red-500 mb-4" />
          <p>Loading Elections...</p>
        </div>
      );
    if (error)
      return (
        <div className="flex h-[80vh] w-full items-center justify-center text-white">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      );
    return (
      <div className="relative w-full min-h-[calc(100vh-150px)]">
        <div
          ref={electionGridRef}
          className={`w-full max-w-5xl mx-auto py-16 ${
            selectedElection ? "invisible absolute" : "visible"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center text-white">
            Your Voice, <span className="text-red-500">Your Vote.</span>
          </h1>
          <p className="text-lg text-gray-400 text-center mb-12">
            Select an active election to cast your vote and make a difference.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {elections.map((election) => {
              const status = getElectionStatus(
                election.startDate,
                election.endDate
              );
              return (
                <div
                  key={election._id}
                  className="election-card-container revolving-border-container"
                >
                  <button
                    className="revolving-border-card w-full p-8 flex flex-col items-center text-center group"
                    onClick={() => handleSelectElection(election)}
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold">
                      <Circle
                        className={`${status.color} fill-current`}
                        size={8}
                      />
                      <span className={status.color}>{status.text}</span>
                    </div>
                    <div className="mb-5 text-red-500/80 group-hover:text-red-500 transition-colors">
                      <Users size={48} strokeWidth={1.5} />
                    </div>
                    <span className="text-xl font-bold text-white mb-2">
                      {election.title}
                    </span>
                    <span className="text-gray-400 text-sm font-light">
                      {election.description}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {selectedElection && (
          <div
            ref={postsViewRef}
            className={`w-full max-w-7xl mx-auto py-8 ${
              !selectedElection ? "invisible absolute" : "visible"
            }`}
          >
            <div className="mb-10 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <h2 className="text-3xl sm:text-4xl font-bold text-white text-right">
                {selectedElection.title}
              </h2>
            </div>
            <div className="space-y-16">
              {selectedElection.posts.map((post) => {
                const postCandidates = candidates.filter(
                  (c) =>
                    c.election?._id === selectedElection._id &&
                    c.electionPost === post.title
                );
                const hasVoted = userVotesForElection[post.title];
                const isElectionOngoing =
                  getElectionStatus(
                    selectedElection.startDate,
                    selectedElection.endDate
                  ).text === "Ongoing";
                return (
                  <div
                    key={post._id}
                    className="post-card bg-[#111113] p-8 rounded-2xl border border-white/10"
                  >
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
                      <h3 className="text-3xl font-semibold text-white">
                        {post.title}
                      </h3>
                      {hasVoted && (
                        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-sm font-medium">
                          <Check className="h-4 w-4" /> Voted
                        </div>
                      )}
                    </div>
                    {postCandidates.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {postCandidates.map((candidate) => (
                          <CandidateVoteCard
                            key={candidate._id}
                            candidate={candidate}
                            hasVoted={hasVoted || !isElectionOngoing}
                            isVoting={voteLoading === post.title}
                            onVote={() =>
                              handleVote(
                                candidate._id,
                                selectedElection._id,
                                post.title
                              )
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        No candidates have registered for this post yet.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={mainContainer}
      className="min-h-screen w-full bg-[#0A0A0A] text-white"
    >
      <Navbar />
      <main className="px-4 sm:px-8">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={400}
            gravity={0.1}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}
        {renderContent()}
      </main>
    </div>
  );
}
