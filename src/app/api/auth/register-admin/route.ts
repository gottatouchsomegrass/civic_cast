// app/api/auth/register-admin/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/model/User";
import connectToDatabase from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Admin with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the role explicitly set to 'admin'
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin", // This is the key difference
      isVerified: true, // Admins can be auto-verified
    });

    return NextResponse.json(
      { message: "Admin account created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin account:", error);

    let errorMessage =
      "An unexpected error occurred while creating the admin account.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        message: "Failed to create admin account.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
