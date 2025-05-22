import connectToDB from "@/lib/mongodb";
import VideoSession from "@/models/VideoSession";
import cloudinary from "@/lib/cloudinary";
import { generateAISolution } from "@/utils/gemini";

export const POST = async (req) => {
  try {
    await connectToDB();

    const { videoBase64, transcript = "No speech detected", question, userId } = await req.json();

    if (!videoBase64 || !question || !userId) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const prompt = `
You are acting as a technical interviewer. A candidate has been asked the following question:

**Question**: ${question}

**Answer Provided**: "${transcript}"

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

    const { marks, comment } = await generateAISolution(prompt);

    const uploadRes = await cloudinary.uploader.upload(videoBase64, {
      resource_type: "video",
      folder: "nextjs-video-uploads",
    });

    const updatedDoc = await VideoSession.findOneAndUpdate(
      { userId },
      {
        $push: {
          answers: {
            question,
            url: uploadRes.secure_url,
            transcript,
            marks,
            comment,
          },
        },
      },
      { upsert: true, new: true }
    );

    return new Response(
      JSON.stringify({
        url: uploadRes.secure_url,
        answers: updatedDoc.answers,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
