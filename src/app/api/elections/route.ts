// app/api/elections/route.ts
import { NextResponse } from "next/server";
import Election from "@/model/Election";
import connectToDatabase from "@/lib/mongodb";

// GET all elections (optionally filter by adminId)
export async function GET(request: Request) {
  await connectToDatabase();
  const url = new URL(request.url);
  const adminId = url.searchParams.get("adminId");
  const filter = adminId ? { createdBy: adminId } : {};
  const elections = await Election.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(elections);
}

// POST a new election
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    // Assume adminId is sent in the request body (should be set from session in real app)
    const { adminId, ...electionData } = body;
    if (!adminId) {
      return NextResponse.json({ message: "Missing adminId (creator) for election." }, { status: 400 });
    }
    const newElection = new Election({ ...electionData, createdBy: adminId });
    await newElection.save();
    return NextResponse.json(newElection, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create election" },
      { status: 500 }
    );
  }
}
