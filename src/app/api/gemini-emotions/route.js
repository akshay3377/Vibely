import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const emotionPrompt = `Given the following message, respond with a JSON object containing:
- "emotion": a single word that best describes the dominant emotion in the message.
- "color": a strong HEX color code (e.g., "#FF5733") that visually represents that emotion.

Message:
"${prompt}"

Respond ONLY with a JSON object like:
{
  "emotion": "angry",
  "color": "#DC2626"
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(emotionPrompt);
    const textResponse = result.response.text().trim();

    console.log("textResponse:", textResponse);

    let parsed = {};
    try {
      // Clean the textResponse by removing markdown code blocks and extracting JSON
      const cleaned = textResponse
        .replace(/```json|```/g, "") // Remove markdown code block markers
        .replace(/^[^{]*({[\s\S]*?})[^}]*$/m, "$1") // Extract JSON object even if surrounded by text
        .trim();

      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse Gemini response:", textResponse);
      return NextResponse.json({ emotion: null, color: null });
    }

    return NextResponse.json({
      emotion: parsed.emotion || null,
      color: parsed.color || null,
    });
  } catch (error) {
    console.error("Gemini SDK error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Gemini SDK" },
      { status: 500 }
    );
  }
}
