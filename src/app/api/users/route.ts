// app/api/users/route.ts
import { NextResponse } from "next/server";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
  await connectToDatabase();
  const voters = await User.find({ role: "voter" }).select("-password");
  const candidates = await User.find({ role: "candidate" }).select("-password");
  return NextResponse.json({ voters, candidates });
}
