import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  const { token } = params;
  const { event } = await request.json();

  if (!["viewed", "started"].includes(event)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const field = event === "viewed" ? "viewedAt" : "startedAt";

  const invite = await prisma.surveyInvite.findUnique({ where: { token } });
  if (!invite) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only set if not already recorded
  if (!invite[field]) {
    await prisma.surveyInvite.update({
      where: { token },
      data: { [field]: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
