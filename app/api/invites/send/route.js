import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInviteEmail, sendBulkInviteEmails } from "@/lib/email-service";

export async function POST(request) {
  try {
    const body = await request.json();
    const origin = request.nextUrl?.origin;

    // ── Envio em lote: { ids: string[] } ──────────────────────────
    if (Array.isArray(body.ids)) {
      const invites = await prisma.surveyInvite.findMany({
        where: {
          id: { in: body.ids },
          clientEmail: { not: null },
          deletedAt: null,
        },
      });

      if (!invites.length) {
        return NextResponse.json({ error: "Nenhum convite válido encontrado." }, { status: 400 });
      }

      const { results, summary } = await sendBulkInviteEmails(invites, origin);
      console.log(`[send] bulk: ${summary.sent} sent, ${summary.failed} failed of ${summary.total}`);
      return NextResponse.json({ results, summary });
    }

    // ── Envio individual: { id: string } ──────────────────────────
    if (body.id) {
      const invite = await prisma.surveyInvite.findUnique({
        where: { id: body.id },
      });

      if (!invite || invite.deletedAt || !invite.clientEmail) {
        return NextResponse.json({ error: "Convite inválido ou sem e-mail." }, { status: 400 });
      }

      const result = await sendInviteEmail(invite, origin);
      console.log(`[send] single: id=${body.id} success=${result.success}`);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Forneça id ou ids." }, { status: 400 });
  } catch (error) {
    console.error("[send] unexpected error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
