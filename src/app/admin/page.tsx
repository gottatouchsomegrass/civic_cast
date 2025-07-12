"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import type { User, Election } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";

// Import all necessary components for the overview page
import StatCard from "@/components/admin/StatCard";
import WeeklyActivityChart from "@/components/admin/WeeklyActivityChart";
import VoteDistributionChart from "@/components/admin/VoteDistributionChart";
import RecentActivityFeed from "@/components/admin/RecentActivityFeed";
import CustomSelect from "@/components/admin/CustomSelect";

// Import icons for use in the dashboard
import { Users, UserPlus, CheckSquare, Vote, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  // --- State Management ---
  const [stats, setStats] = useState<any>(null);
  const [chartElectionId, setChartElectionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dashboardRef = useRef<HTMLDivElement>(null);

  // --- Animations ---
  useGSAP(
    () => {
      if (loading) return; // Prevent animation from running on initial load
      gsap.from(".dashboard-item", {
        autoAlpha: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: dashboardRef, dependencies: [loading] }
  );

  // --- Data Fetching ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard-stats");
        if (!res.ok)
          throw new Error("Failed to load dashboard data. Please try again.");

        const data = await res.json();
        setStats(data);

        // Set a default election for the chart when the data arrives
        if (data.allElections && data.allElections.length > 0) {
          setChartElectionId(data.allElections[0]._id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // --- Memoized Calculations for Performance ---
  const chartCandidates = useMemo(() => {
    if (!chartElectionId || !stats?.allCandidates) return [];
    return stats.allCandidates.filter(
      (c: User) => c.election?._id === chartElectionId
    );
  }, [chartElectionId, stats?.allCandidates]);

  const electionOptions = useMemo(() => {
    if (!stats?.allElections) return [];
    return stats.allElections.map((election: Election) => ({
      value: election._id,
      label: election.title,
    }));
  }, [stats?.allElections]);

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-gray-400">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div ref={dashboardRef} className="space-y-8">
      {/* Header */}
      <div className="dashboard-item">
        <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-gray-400 mt-1">
          A high-level summary of all election activity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-item">
          <StatCard
            title="Total Candidates"
            value={stats.totalCandidates}
            icon={UserPlus}
          />
        </div>
        <div className="dashboard-item">
          <StatCard
            title="Registered Voters"
            value={stats.totalVoters}
            icon={Users}
          />
        </div>
        <div className="dashboard-item">
          <StatCard
            title="Total Elections"
            value={stats.totalElections}
            icon={CheckSquare}
          />
        </div>
        <div className="dashboard-item">
          <StatCard
            title="Total Votes Cast"
            value={stats.totalVotes}
            icon={Vote}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 dashboard-item">
          <WeeklyActivityChart activity={stats.weeklyActivity} />
        </div>
        <div className="dashboard-item">
          <div className="bg-[#181818] p-6 rounded-lg border border-gray-800 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Vote Distribution
              </h3>
              <CustomSelect
                options={electionOptions}
                value={chartElectionId}
                onChange={setChartElectionId}
              />
            </div>
            <div className="flex-grow">
              <VoteDistributionChart candidates={chartCandidates} />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dashboard-item">
          <RecentActivityFeed users={stats.recentUsers} />
        </div>
        <div className="lg:col-span-2 dashboard-item bg-[#181818] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/manage-candidates"
              className="flex justify-between items-center p-4 bg-[#282828] rounded-lg hover:bg-red-600/20 transition-colors"
            >
              <span>Register a New Candidate</span>
              <ArrowRight className="h-5 w-5 text-red-500" />
            </Link>
            <Link
              href="/admin/election-settings"
              className="flex justify-between items-center p-4 bg-[#282828] rounded-lg hover:bg-red-600/20 transition-colors"
            >
              <span>Create a New Election</span>
              <ArrowRight className="h-5 w-5 text-red-500" />
            </Link>
            <Link
              href="/admin/results"
              className="flex justify-between items-center p-4 bg-[#282828] rounded-lg hover:bg-red-600/20 transition-colors"
            >
              <span>View Full Results</span>
              <ArrowRight className="h-5 w-5 text-red-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
