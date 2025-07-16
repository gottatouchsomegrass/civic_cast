import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Election from "@/model/Election";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const elections = await Election.find({
      createdBy: session.user._id,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(elections);
  } catch (error) {
    console.error("GET /api/admin/elections failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
