import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const prompt1 = `Summarize the emotional intent or overall message below in 8–12 words. Focus on what the person is feeling or trying to express. Be natural and human-like. Avoid emojis, repetition, and generic summaries.\n\nMessage:\n"${prompt}"`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt1);
    const response = result.response.text();

    return NextResponse.json({ output: response });
  } catch (error) {
    console.error("Gemini SDK error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Gemini SDK" },
      { status: 500 }
    );
  }
}
