// app/api/users/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/model/User";

export async function GET() {
  await connectToDatabase();

  try {
    // --- FIX: Add .populate('election') to the query for candidates ---
    const candidates = await User.find({ role: "candidate" }).populate(
      "election"
    );
    const voters = await User.find({ role: "voter" }).select("-password"); // Voters don't need population

    return NextResponse.json({ voters, candidates });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
