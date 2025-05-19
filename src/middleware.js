import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const cookieStore = await cookies();
  const data = cookieStore.get("USER");




  let user = null;
if (data) {
  try {
    user = JSON.parse(data?.value);
  } catch (err) {
    console.error("Invalid cookie format:", err);
  }
}



 

  const url = req.url;

  if (user?.id) {
    if (url.includes("/login") || url.includes("/register")) {
      return NextResponse.redirect(new URL("/conversation", req.url));
    }
  } else {
    if (url.includes("/conversation")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
