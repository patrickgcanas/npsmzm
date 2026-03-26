import { NextResponse } from "next/server";

async function sign(data, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function verifyToken(token) {
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return false;
  const payload = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);
  const expected = await sign(payload, secret);
  if (expected !== sig) return false;
  return Date.now() < parseInt(payload, 10);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Always public
  if (
    pathname === "/login" ||
    pathname.startsWith("/survey/") ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/responses/") ||
    (pathname.startsWith("/api/invites/") && pathname.endsWith("/track"))
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("mzm-auth")?.value;
  const valid = await verifyToken(token);

  if (!valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|logo-mzm\\.png).*)"],
};
