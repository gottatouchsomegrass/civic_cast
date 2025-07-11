import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role)
    return NextResponse.json(
      { message: "All fields (name, email, password, role) are required" },
      { status: 400 }
    );

  const allowedRoles = ["voter", "candidate", "admin"];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json(
      { message: "Invalid role selected" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: true, // Temporarily true for testing; implement email verification later
    role,
  });

  return NextResponse.json({ message: "User created successfully" });
}
