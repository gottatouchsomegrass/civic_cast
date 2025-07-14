import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Vote from "@/model/Vote";

export async function POST(request: Request) {
  try {
    const { voterId, electionId } = await request.json();
    if (!voterId || !electionId) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const votes = await Vote.find({ voterId, electionId }).select("post -_id");

    const votedPosts = votes.reduce((acc: Record<string, boolean>, vote) => {
      acc[vote.post] = true;
      return acc;
    }, {});

    return NextResponse.json(votedPosts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to check votes." },
      { status: 500 }
    );
  }
}
