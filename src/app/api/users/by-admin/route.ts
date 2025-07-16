import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Election from "@/model/Election";
import mongoose from "mongoose";

import "@/model/Vote";
import "@/model/User";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?._id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    const adminId = new mongoose.Types.ObjectId(session.user._id);

    const voters = await Election.aggregate([
      {
        $match: { createdBy: adminId },
      },

      {
        $lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "electionId",
          as: "electionVotes",
        },
      },

      {
        $unwind: "$electionVotes",
      },

      {
        $group: {
          _id: "$electionVotes.voterId",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "voterDetails",
        },
      },

      {
        $unwind: "$voterDetails",
      },

      {
        $replaceRoot: { newRoot: "$voterDetails" },
      },

      {
        $project: {
          password: 0,
        },
      },
    ]);

    return NextResponse.json(voters);
  } catch (error) {
    console.error("Failed to fetch voters for admin:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
