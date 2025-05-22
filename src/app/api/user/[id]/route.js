import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { id } = params; // get user id from route

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing user ID" }), { status: 400 });
    }

    // Find user by id and exclude sensitive fields if any
    const user = await User.findById(id)

    console.log('user', user)

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    console.error("User fetch error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
