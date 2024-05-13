import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/@")) {
    const nextPathname = "/profile/" + request.nextUrl.pathname.slice(2);

    return NextResponse.rewrite(new URL(nextPathname, request.nextUrl));
  }
}
