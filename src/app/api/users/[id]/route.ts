// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

interface ParamsContext {
  params: {
    id: string;
  };
}

// The function signature now uses the clean, dedicated interface.
export async function DELETE(request: NextRequest, context: ParamsContext) {
  // Destructure the id from the well-typed context object.
  const { id } = context.params;

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
