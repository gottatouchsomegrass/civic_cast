import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Election from "@/model/Election";
import dbConnect from "@/lib/mongodb";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?._id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
    }

    await dbConnect();

    const electionToDelete = await Election.findById(id);
    if (!electionToDelete) {
      return NextResponse.json(
        { message: "Election not found" },
        { status: 404 }
      );
    }

    if (electionToDelete.createdBy.toString() !== session.user._id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Election.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Election deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/elections/[id] failed:`, error);
    return NextResponse.json(
      { message: "Failed to delete election" },
      { status: 500 }
    );
  }
}
