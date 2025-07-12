// app/api/elections/route.ts
import { NextResponse } from "next/server";
import Election from "@/model/Election";
import connectToDatabase from "@/lib/mongodb";

// GET all elections
export async function GET() {
  await connectToDatabase();
  const elections = await Election.find({}).sort({ createdAt: -1 });
  return NextResponse.json(elections);
}

// POST a new election
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newElection = new Election(body);
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
