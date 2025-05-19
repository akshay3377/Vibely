import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("USER");

  const token = theme?.value;

  console.log("token", token);

  const url = req.url;

  if (token) {
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
