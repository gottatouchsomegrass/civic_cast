// app/api/upload-image/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  // Convert the file to a buffer
  const fileBuffer = await file.arrayBuffer();
  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");
  const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "civiccast_candidates", // Optional: store in a specific folder
    });

    // Return the secure URL of the uploaded image
    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Image upload failed." },
      { status: 500 }
    );
  }
}
