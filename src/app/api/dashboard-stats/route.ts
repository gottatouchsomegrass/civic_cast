// app/api/dashboard-stats/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/model/User";
import Vote from "@/model/Vote";
import Election from "@/model/Election";
import { startOfDay, subDays } from "date-fns";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const url = new URL(request.url);
    const adminId = url.searchParams.get("adminId");
    const electionFilter = adminId ? { createdBy: adminId } : {};
    // 1. Find all elections created by this admin
    const allElections = await Election.find(electionFilter).sort({ createdAt: -1 });
    const electionIds = allElections.map((e) => e._id);
    // 2. Candidates for these elections
    const allCandidates = await User.find({ role: "candidate", election: { $in: electionIds } }).populate("election", "title");
    // 3. Voters who have voted in these elections
    const votes = await Vote.find({ electionId: { $in: electionIds } });
    const voterIds = [...new Set(votes.map((v) => v.voterId.toString()))];
    const totalVoters = voterIds.length;
    // 4. Total votes cast in these elections
    const totalVotes = votes.length;
    // 5. Recent users (candidates or voters) for these elections
    const recentUsers = await User.find({
      $or: [
        { role: "candidate", election: { $in: electionIds } },
        { _id: { $in: voterIds } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5);
    // 6. Weekly activity for these elections
    const today = startOfDay(new Date());
    const weeklyVoteData = await Vote.aggregate([
      { $match: { electionId: { $in: electionIds }, createdAt: { $gte: subDays(new Date(), 7) } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
    ]);
    const activityByDate: { [key: string]: number } = {};
    weeklyVoteData.forEach((day) => {
      activityByDate[day._id] = day.count;
    });
    const weeklyActivity = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(today, 6 - i);
      const dateString = date.toISOString().split("T")[0];
      return {
        date: dateString,
        count: activityByDate[dateString] || 0,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
      };
    });
    // Return the complete payload for the dashboard
    return NextResponse.json({
      totalCandidates: allCandidates.length,
      totalVoters,
      totalElections: allElections.length,
      totalVotes,
      allCandidates,
      allElections,
      recentUsers,
      weeklyActivity,
    });
  } catch (error) {
    let errorMessage =
      "An unexpected error occurred while fetching dashboard stats.";
    if (error instanceof Error) {
      errorMessage = `Error fetching dashboard stats: ${error.message}`;
      console.error(errorMessage);
    } else {
      console.error("An unknown error occurred:", error);
    }
  }
}
