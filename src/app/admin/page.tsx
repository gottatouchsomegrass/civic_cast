"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import type { User, Election } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useSession } from "next-auth/react";

import StatCard from "@/components/admin/StatCard";
import WeeklyActivityChart from "@/components/admin/WeeklyActivityChart";
import VoteDistributionChart from "@/components/admin/VoteDistributionChart";
import RecentActivityFeed from "@/components/admin/RecentActivityFeed";
import CustomSelect from "@/components/admin/CustomSelect";

import { Users, UserPlus, CheckSquare, Vote, ArrowRight } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface DashboardStats {
  totalCandidates: string;
  totalVoters: string;
  totalElections: string;
  totalVotes: string;
  weeklyActivity: { date: string; count: number; day: string }[];
  allElections: Election[];
  allCandidates: User[];
  recentUsers: User[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartElectionId, setChartElectionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const adminId = session?.user?._id;

  const dashboardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (loading) return;
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!adminId) return;
        const res = await fetch(`/api/dashboard-stats?adminId=${adminId}`);
        if (!res.ok)
          throw new Error("Failed to load dashboard data. Please try again.");

        const data: DashboardStats = await res.json();
        setStats(data);

        if (data.allElections && data.allElections.length > 0) {
          setChartElectionId(data.allElections[0]._id);
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
    fetchDashboardData();
  }, [adminId]);

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

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner text="Loading Dashboard..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-400">No data available.</p>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="space-y-8">
      {/* Header */}
      <div className="dashboard-item">
        <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
        <p className="mt-1 text-gray-400">
          A high-level summary of all election activity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="dashboard-item lg:col-span-2">
          <WeeklyActivityChart activity={stats.weeklyActivity} />
        </div>
        <div className="dashboard-item">
          <div className="flex h-full flex-col rounded-lg border border-gray-800 bg-[#181818] p-6">
            <div className="mb-4 flex items-center justify-between">
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="dashboard-item">
          <RecentActivityFeed users={stats.recentUsers} />
        </div>
        <div className="dashboard-item rounded-lg border border-gray-800 bg-[#181818] p-6 lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/manage-candidates"
              className="flex items-center justify-between rounded-lg bg-[#282828] p-4 transition-colors hover:bg-red-600/20"
            >
              <span>Register a New Candidate</span>
              <ArrowRight className="h-5 w-5 text-red-500" />
            </Link>
            <Link
              href="/admin/election-settings"
              className="flex items-center justify-between rounded-lg bg-[#282828] p-4 transition-colors hover:bg-red-600/20"
            >
              <span>Create a New Election</span>
              <ArrowRight className="h-5 w-5 text-red-500" />
            </Link>
            <Link
              href="/admin/results"
              className="flex items-center justify-between rounded-lg bg-[#282828] p-4 transition-colors hover:bg-red-600/20"
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
