import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/model/User";
import Vote from "@/model/Vote";
import Election from "@/model/Election";

export async function GET(request: Request) {
  await connectToDatabase();
  const url = new URL(request.url);
  const adminId = url.searchParams.get("adminId");
  if (!adminId) {
    return NextResponse.json({ message: "Missing adminId" }, { status: 400 });
  }
  try {
    // 1. Find all elections created by this admin
    const elections = await Election.find({ createdBy: adminId }).select("_id");
    const electionIds = elections.map((e) => e._id);
    if (electionIds.length === 0) {
      return NextResponse.json({ voters: [] });
    }
    // 2. Find all votes in those elections
    const votes = await Vote.find({ electionId: { $in: electionIds } }).select("voterId");
    const voterIds = [...new Set(votes.map((v) => v.voterId.toString()))];
    if (voterIds.length === 0) {
      return NextResponse.json({ voters: [] });
    }
    // 3. Get voter user details
    const voters = await User.find({ _id: { $in: voterIds }, role: "voter" }).select("-password");
    return NextResponse.json({ voters });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch voters by admin" },
      { status: 500 }
    );
  }
} 