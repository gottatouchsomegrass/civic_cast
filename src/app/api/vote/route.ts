import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Vote from "@/model/Vote";
import User from "@/model/User";
import Election from "@/model/Election";

export async function POST(request: Request) {
  try {
    const { voterId, candidateId, electionId, post } = await request.json();
    if (!voterId || !candidateId || !electionId || !post) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    await dbConnect();

    const election = await Election.findById(electionId);

    if (!election) {
      return NextResponse.json(
        { message: "Election not found." },
        { status: 404 }
      );
    }

    const now = new Date();
    if (now < election.startDate) {
      return NextResponse.json(
        { message: "This election has not started yet." },
        { status: 403 }
      );
    }

    if (now > election.endDate) {
      return NextResponse.json(
        { message: "This election has already ended." },
        { status: 403 }
      );
    }

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
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === 11000
    ) {
      return NextResponse.json(
        { message: "You have already voted for this post in this election." },
        { status: 409 }
      );
    }

    console.error("Error casting vote:", error);
    return NextResponse.json(
      { message: "An internal error occurred while casting your vote." },
      { status: 500 }
    );
  }
}
