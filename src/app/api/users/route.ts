import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/model/User";

export async function GET() {
  await connectToDatabase();
  console.log("Connected to database");

  try {
    console.log("Querying users...");
    const candidates = await User.find({ role: "candidate" }).populate(
      "election"
    );

    const voters = await User.find({ role: "voter" }).select("-password");

    return NextResponse.json({ voters, candidates });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
