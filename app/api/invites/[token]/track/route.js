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

  // Update invite field on first occurrence only (keeps backward-compat metrics)
  if (!invite[field]) {
    await prisma.surveyInvite.update({
      where: { token },
      data: { [field]: new Date() },
    });
  }

  // Always update the latest send record so per-send tracking reflects current engagement
  const latestSend = await prisma.surveyInviteSend.findFirst({
    where: { inviteId: invite.id },
    orderBy: { sendNumber: "desc" },
  });
  if (latestSend && !latestSend[field]) {
    await prisma.surveyInviteSend.update({
      where: { id: latestSend.id },
      data: { [field]: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
