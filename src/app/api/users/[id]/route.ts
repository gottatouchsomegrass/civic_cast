// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

export async function DELETE(request, { params }) {
  await connectToDatabase();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "User deleted successfully" });
}
