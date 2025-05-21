import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { question, answer } = await req.json();

  if (!question || !answer) {
    return NextResponse.json({ error: "Both question and answer are required" }, { status: 400 });
  }

const prompt = `
You are acting as a technical interviewer. A candidate has been asked the following question:

**Question**: ${question}

**Answer Provided**: "${answer}"

Evaluate the answer out of 5 (half points allowed), and return a JSON object with two keys:

- "marks": number (0 to 5)
- "comment": a direct, professional explanation of the score

When scoring:
- Be understanding of minor mistakes like small typos, mispronunciations, or slight wording issues (e.g., saying "virtual home" instead of "virtual DOM") — they may be due to accent or nervousness.
- Focus on whether the core technical concepts are conveyed accurately.
- Be fair, concise, and human in your evaluation — aim to mimic a real-life interviewer's thought process.

Only respond with a raw JSON object, like:
{ "marks": 2.5, "comment": "The answer lacks depth. Key concepts like JSX and virtual DOM are missing." }

Do not include explanations, markdown, or code blocks. Only return valid JSON.
`;


  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Ensure it's valid JSON (strip surrounding code block if needed)
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini SDK error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Gemini SDK" },
      { status: 500 }
    );
  }
}
