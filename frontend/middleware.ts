import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo actuamos en rutas con protección
  const isAdminRoute = pathname.startsWith("/admin");
  const isClienteRoute = pathname.startsWith("/cliente");
  if (!isAdminRoute && !isClienteRoute) {
    return NextResponse.next();
  }

  // Obtenemos sesión segura del lado del servidor
  const session = await auth();
  const rol = (session?.user as { rol?: string } | undefined)?.rol;
  const esAdmin = rol === "ADMIN" || rol === "admin";

  // Si no hay sesión, redirigimos a login
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Bloqueo explícito: rutas /admin requieren rol ADMIN
  if (isAdminRoute && !esAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.delete("callbackUrl");
    return NextResponse.redirect(url);
  }

  // Para /cliente basta estar autenticado (rol libre)
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*"],
};
