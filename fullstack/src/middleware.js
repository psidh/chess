import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPrivatePath =
    path === "/home" ||
    path === "/home/1v1" ||
    path === "/home/random-game" ||
    path === "/home/profile";

  const token = request.cookies.get("token")?.value || "";
  
  if (isPrivatePath && token === "") {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/login",
    "/signup",
    "/home/1v1",
    "/home/random-game",
    "/home/profile",
  ],
};
