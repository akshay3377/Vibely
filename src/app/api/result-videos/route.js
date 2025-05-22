import { NextResponse } from "next/server";
import mongoose from "mongoose";
// import { connectToDB } from "@/utils/"; // adjust path to your DB utility
import VideoSession from "@/models/VideoSession"; // adjust to your model file
import connectToDB from "@/lib/mongodb";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userIdStr = searchParams.get("userId");
    console.log('userIdStr', userIdStr)

    // Validate query
    if (!userIdStr) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userIdStr)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(userIdStr);

    const session = await VideoSession.findOne({ userId }).lean();

    if (!session) {
      return NextResponse.json({ answers: [] }, { status: 200 });
    }

    return NextResponse.json({ answers: session.answers }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
