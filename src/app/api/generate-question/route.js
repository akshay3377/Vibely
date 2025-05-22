import { generateAISolution } from "@/utils/gemini";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: "resumeText is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert technical interviewer. Based on the following resume text, generate a list of 5 relevant technical questions that could be asked in an interview. Make the questions clear and concise.

Resume Text:
${resumeText}

Return the questions as a JSON array of strings, e.g.:
["What is React?", "Explain event delegation."]
Only return the JSON array, no explanations or extra text.
  `;

    const response = await generateAISolution(prompt);
    return NextResponse.json({ data: response });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
