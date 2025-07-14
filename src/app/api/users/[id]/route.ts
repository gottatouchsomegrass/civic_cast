import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

type ContextType = {
  params: {
    id: string;
  };
};

export async function DELETE(_: NextRequest, context: ContextType) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

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
