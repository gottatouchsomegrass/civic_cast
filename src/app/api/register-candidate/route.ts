import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { name, email, password, electionId, electionPost, profilePicture } =
      await request.json();

    if (
      !name ||
      !email ||
      !password ||
      !electionId ||
      !electionPost ||
      !profilePicture
    ) {
      return NextResponse.json(
        { message: "All fields, including profile picture, are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "candidate",
      election: electionId,
      electionPost,
      profilePicture,
      isVerified: true,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while registering the candidate." },
      { status: 500 }
    );
  }
}
