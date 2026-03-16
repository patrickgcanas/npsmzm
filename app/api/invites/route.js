import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { advisors, buildInviteMessage } from "@/lib/survey";
import { getAppUrl } from "@/lib/data";

export async function POST(request) {
  try {
    const body = await request.json();
    const clientName = body.clientName?.trim();
    const clientEmail = body.clientEmail?.trim() || null;
    const advisor = body.advisor?.trim();
    const relationshipNote = body.relationshipNote?.trim() || null;

    if (!clientName) {
      return NextResponse.json({ error: "Informe o nome do cliente." }, { status: 400 });
    }

    if (!advisor || !advisors.includes(advisor)) {
      return NextResponse.json({ error: "Selecione um advisor válido." }, { status: 400 });
    }

    const token = crypto.randomUUID().replace(/-/g, "");
    const invite = await prisma.surveyInvite.create({
      data: {
        token,
        clientName,
        clientEmail,
        advisor,
        relationshipNote,
      },
    });

    const requestOrigin = request.nextUrl?.origin;
    const inviteUrl = `${requestOrigin || getAppUrl()}/survey/${invite.token}`;
    const message = buildInviteMessage({
      clientName: invite.clientName,
      advisor: invite.advisor,
      inviteUrl,
      relationshipNote: invite.relationshipNote,
    });

    return NextResponse.json({
      inviteId: invite.id,
      token: invite.token,
      inviteUrl,
      message,
    });
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível criar o convite." }, { status: 500 });
  }
}
