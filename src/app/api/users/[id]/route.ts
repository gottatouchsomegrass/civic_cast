// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

// This signature directly follows the Next.js documentation for dynamic routes.
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectToDatabase();

    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user deletion:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
