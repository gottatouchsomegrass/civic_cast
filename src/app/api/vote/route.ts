import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Vote from "@/model/Vote";
import User from "@/model/User";

export async function POST(request: Request) {
  try {
    const { voterId, candidateId, electionId, post } = await request.json();
    if (!voterId || !candidateId || !electionId || !post) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    await connectToDatabase();

    // Check if the voter has already voted for this post in this election
    const existingVote = await Vote.findOne({
      voterId,
      electionId,
      post,
    });
    if (existingVote) {
      return NextResponse.json({ message: "You have already voted for this post." }, { status: 409 });
    }

    // Increment the candidate's vote count
    await User.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

    await Vote.create({
      voterId,
      candidateId,
      electionId,
      post,
    });

    // Add this vote to the voter's votes array
    await User.findByIdAndUpdate(
      voterId,
      { $push: { votes: { election: electionId, candidate: candidateId, post } } }
    );

    return NextResponse.json({ message: "Vote cast successfully." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to cast vote." }, { status: 500 });
  }
} 