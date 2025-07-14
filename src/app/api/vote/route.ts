import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Vote from "@/model/Vote";
import User from "@/model/User";

export async function POST(request: Request) {
  try {
    const { voterId, candidateId, electionId, post } = await request.json();
    if (!voterId || !candidateId || !electionId || !post) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await Vote.create({
      voterId,
      candidateId,
      electionId,
      post,
    });

    await User.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

    return NextResponse.json(
      { message: "Vote cast successfully." },
      { status: 201 }
    );
  } catch (error: Error | unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === 11000
    ) {
      return NextResponse.json(
        { message: "You have already voted for this post." },
        { status: 409 }
      );
    }

    console.error("Error casting vote:", error);
    return NextResponse.json(
      { message: "Failed to cast vote." },
      { status: 500 }
    );
  }
}
