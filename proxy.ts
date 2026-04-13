import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";

const protectedPrefixes = ["/dashboard", "/employees", "/offer-letter", "/api/employees"];

const roleRoutes: Record<string, string[]> = {
  Admin: protectedPrefixes,
  HR: ["/dashboard", "/employees", "/offer-letter", "/api/employees"],
  TL: ["/dashboard", "/employees", "/offer-letter", "/api/employees"],
  Employee: ["/offer-letter"],
};

function isProtectedPath(pathname: string) {
  if (pathname === "/") return true;
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login" || pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getAuthCookieName())?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const allowed = (roleRoutes[payload.role] || []).some((route) =>
    pathname.startsWith(route),
  );
  if (!allowed) {
    return NextResponse.redirect(new URL("/offer-letter", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/employees/:path*",
    "/offer-letter/:path*",
    "/api/employees/:path*",
  ],
};
