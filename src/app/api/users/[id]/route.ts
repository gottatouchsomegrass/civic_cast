// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

// The handler receives two arguments: the request and a context object.
// We only need the context object, so we can ignore the first argument.
export async function DELETE(
  _request: Request, // The first argument is the Request object, ignored here
  { params }: { params: { id: string } } // The second argument contains the typed params
) {
  try {
    await connectToDatabase();

    // Now 'params.id' is known to be a string.
    await User.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
