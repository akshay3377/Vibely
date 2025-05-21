import connectToDB from "@/lib/mongodb";
import Video from "@/models/Video";

export const GET = async () => {
  try {
    await connectToDB();
    const videos = await Video.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(videos), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch videos" }), { status: 500 });
  }
};
