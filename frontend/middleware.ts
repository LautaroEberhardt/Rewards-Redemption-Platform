import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requiresAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/cliente");
  if (!requiresAuth) return NextResponse.next();

  const hasSession = SESSION_COOKIES.some((key) => req.cookies.get(key)?.value);
  if (hasSession) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*"],
};
