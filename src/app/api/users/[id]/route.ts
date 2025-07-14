// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

// The route handler receives the request and a context object.
// The context object contains the dynamic route parameters.
export async function DELETE(
  _request: Request,
  context: { params: { id: string } }
) {
  // Destructure the id from the context object's params property.
  const { id } = context.params;

  try {
    await connectToDatabase();

    // Check if the user exists before attempting to delete
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
    console.error("Error deleting user:", error);

    let errorMessage = "An unexpected error occurred while deleting the user.";
    if (error instanceof Error) {
      // Avoid exposing internal details in production
      errorMessage = "Could not process the delete request.";
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
