import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAISolution(prompt){


  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const response = JSON.parse(cleaned);

    // if (!Array.isArray(response)) {
    //   throw new Error("Gemini response is not a valid array");
    // }

    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate interview response");
  }
}
