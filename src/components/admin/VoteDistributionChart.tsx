// app/components/admin/VoteDistributionChart.tsx
"use client";
import React from "react";
import type { User } from "@/types";

const COLORS = ["#e50914", "#f5c518", "#4a90e2", "#34d399", "#a78bfa"];

export default function VoteDistributionChart({
  candidates,
}: {
  candidates: User[];
}) {
  const validCandidates = Array.isArray(candidates) ? candidates : [];
  const totalVotes = validCandidates.reduce(
    (sum, c) => sum + (c.voteCount || 0),
    0
  );

  if (validCandidates.length === 0) {
    return (
      <div className="bg-[#181818] p-6 rounded-lg border border-gray-800 h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Vote Distribution
          </h3>
          <p className="text-gray-500">
            No candidate data to display for this selection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] p-6 rounded-lg border border-gray-800 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">
        Top Candidate Vote Share
      </h3>
      <div className="flex items-center justify-center h-48">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="transparent"
            stroke="#333"
            strokeWidth="3"
          ></circle>
          {validCandidates.map((candidate, index) => {
            const percentage =
              totalVotes > 0
                ? ((candidate.voteCount || 0) / totalVotes) * 100
                : 0;
            const offsetPercentage = validCandidates
              .slice(0, index)
              .reduce((acc, c) => {
                const prevPercentage =
                  totalVotes > 0 ? ((c.voteCount || 0) / totalVotes) * 100 : 0;
                return acc + prevPercentage;
              }, 0);

            return (
              <circle
                key={candidate._id}
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke={COLORS[index % COLORS.length]}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeDashoffset={-offsetPercentage}
              ></circle>
            );
          })}
        </svg>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {validCandidates.map((candidate, index) => {
          const percentage =
            totalVotes > 0
              ? ((candidate.voteCount || 0) / totalVotes) * 100
              : 0;
          return (
            <div
              key={candidate._id}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                {candidate.name}
              </span>
              <span className="font-semibold">{percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
