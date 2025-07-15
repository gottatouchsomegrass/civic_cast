import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Election from "@/model/Election";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (session?.user?.role === "admin") {
      const elections = await Election.find({
        createdBy: session.user._id,
      }).sort({
        createdAt: -1,
      });
      return NextResponse.json(elections);
    } else {
      const elections = await Election.find({}).sort({ createdAt: -1 });
      return NextResponse.json(elections);
    }
  } catch (error) {
    console.error("GET /api/elections failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    const { title, description, startDate, endDate, posts } = body;
    if (
      !title ||
      !startDate ||
      !endDate ||
      !description ||
      !posts ||
      posts.length === 0
    ) {
      return NextResponse.json(
        { message: "Missing required fields for election." },
        { status: 400 }
      );
    }

    const newElection = new Election({
      ...body,
      createdBy: session.user._id,
    });

    await newElection.save();
    return NextResponse.json(newElection, { status: 201 });
  } catch (error) {
    console.error("POST /api/elections failed:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Failed to create election" },
      { status: 500 }
    );
  }
}
