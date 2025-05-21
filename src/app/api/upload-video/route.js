import connectToDB from "@/lib/mongodb";
import Video from "@/models/Video";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { videoBase64, transcript } = await req.json();

    if (!videoBase64) {
      return new Response(JSON.stringify({ error: "No video data" }), { status: 400 });
    }

    const uploadRes = await cloudinary.uploader.upload(videoBase64, {
      resource_type: "video",
      folder: "nextjs-video-uploads",
    });

    const newVideo = new Video({
      url: uploadRes.secure_url,
      transcript: transcript || "No speech detected",
    });
    await newVideo.save();

    return new Response(JSON.stringify({ url: uploadRes.secure_url }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
