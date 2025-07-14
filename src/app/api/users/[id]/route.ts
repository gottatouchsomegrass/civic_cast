import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

// The function signature must destructure `params` from a context
// object with an explicitly defined inline type.
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // `params` is now correctly typed, and `id` is a string.
  const { id } = params;

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
