import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

async function sign(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64");
}

export async function POST(request) {
  const { email, password } = await request.json();

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!expectedEmail || !expectedPassword || !secret) {
    return NextResponse.json({ error: "Servidor não configurado." }, { status: 500 });
  }

  if (email !== expectedEmail || password !== expectedPassword) {
    return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  }

  const exp = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
  const payload = String(exp);
  const sig = await sign(payload, secret);
  const token = `${payload}.${sig}`;

  const cookieStore = await cookies();
  cookieStore.set("mzm-auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });

  return NextResponse.json({ ok: true });
}
