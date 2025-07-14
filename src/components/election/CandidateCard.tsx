"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Check, Vote } from "lucide-react";
import type { User } from "@/types";

interface CandidateVoteCardProps {
  candidate: User;
  onVote: () => void;
  isVoting: boolean;
  hasVoted: boolean;
}

export default function CandidateVoteCard({
  candidate,
  onVote,
  isVoting,
  hasVoted,
}: CandidateVoteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Enhanced 3D Tilt & Glow Effect ---
  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = gsap.utils.mapRange(0, height, -10, 10, y);
        const rotateY = gsap.utils.mapRange(0, width, 10, -10, x);

        // Animate the card tilt
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          scale: 1.05,
          ease: "power2.out",
          duration: 0.5,
        });

        // Animate the glow to follow the mouse
        gsap.to(card, {
          "--x": `${x}px`,
          "--y": `${y}px`,
          ease: "power2.out",
          duration: 0.3,
        });
      };

      const handleMouseLeave = () => {
        // Reset the card to its original state
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          ease: "elastic.out(1, 0.5)",
          duration: 1,
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: cardRef }
  );

  return (
    <div
      ref={cardRef}
      className="candidate-card-glow relative flex flex-col items-center bg-[#111113] p-6 rounded-2xl border border-white/10 shadow-lg"
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      <Image
        src={candidate.profilePicture || "/file.svg"}
        alt={candidate.name}
        width={100}
        height={100}
        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-700 shadow-xl"
        style={{ transform: "translateZ(50px)" }} // Pushed forward in 3D space
      />
      <h3
        className="text-white font-bold text-xl mb-1 text-center"
        style={{ transform: "translateZ(40px)" }}
      >
        {candidate.name}
      </h3>
      <p
        className="text-gray-400 text-sm mb-5 text-center break-words"
        style={{ transform: "translateZ(30px)" }}
      >
        {candidate.email}
      </p>
      <Button
        disabled={hasVoted || isVoting}
        onClick={onVote}
        className={`w-full mt-auto text-base py-3 h-auto transition-all duration-300
          ${
            hasVoted
              ? "bg-green-600 hover:bg-green-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }
          disabled:bg-gray-700 disabled:opacity-70`}
        style={{ transform: "translateZ(20px)" }}
      >
        {isVoting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : hasVoted ? (
          <span className="flex items-center gap-2">
            <Check className="h-5 w-5" /> Voted
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Vote className="h-5 w-5" /> Vote Now
          </span>
        )}
      </Button>
    </div>
  );
}
