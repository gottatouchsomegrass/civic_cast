// app/api/dashboard-stats/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/model/User";
import Vote from "@/model/Vote";
import Election from "@/model/Election";
import { startOfDay, subDays } from "date-fns";

export async function GET() {
  try {
    await connectToDatabase();

    // Use Promise.all to fetch data concurrently for better performance
    const [
      totalCandidates,
      totalVoters,
      totalElections,
      totalVotes,
      allCandidates,
      allElections,
      recentUsers,
      weeklyVoteData,
    ] = await Promise.all([
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "voter" }),
      Election.countDocuments(),
      Vote.countDocuments(),
      User.find({ role: "candidate" }).populate("election", "title"),
      Election.find({}).sort({ createdAt: -1 }),
      User.find().sort({ createdAt: -1 }).limit(5), // For the activity feed
      Vote.aggregate([
        // For the weekly activity chart
        { $match: { createdAt: { $gte: subDays(new Date(), 7) } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Format the weekly activity data
    const today = startOfDay(new Date());
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
      totalCandidates,
      totalVoters,
      totalElections,
      totalVotes,
      allCandidates,
      allElections,
      recentUsers,
      weeklyActivity,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error.message);
    return NextResponse.json(
      { message: `Error fetching dashboard stats: ${error.message}` },
      { status: 500 }
    );
  }
}
