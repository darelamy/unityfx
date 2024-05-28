import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (token) {
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  } else {
    if (pathname.startsWith("/@") && pathname.endsWith("/edit")) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    if (pathname.startsWith("/create")) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  if (pathname.startsWith("/@")) {
    const nextPathname = "/profile/" + pathname.slice(2);
    return NextResponse.rewrite(new URL(nextPathname, request.nextUrl));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/login", "/register", "/create", "/@:username/edit"],
};
