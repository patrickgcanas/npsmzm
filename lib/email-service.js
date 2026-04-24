import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { buildInviteMessage, INVITE_SUBJECT } from "@/lib/survey";
import { getAppUrl } from "@/lib/data";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildInviteUrl(token, requestOrigin) {
  const base = requestOrigin || getAppUrl();
  return `${base}/survey/${token}`;
}

export async function sendInviteEmail(invite, requestOrigin) {
  const inviteUrl = buildInviteUrl(invite.token, requestOrigin);
  const text = buildInviteMessage({ clientName: invite.clientName, inviteUrl });

  const htmlBody = text
    .split("\n")
    .map((line) => `<p style="margin:0 0 8px 0;font-family:sans-serif;font-size:15px;color:#1a1a1a;">${line || "&nbsp;"}</p>`)
    .join("");

  try {
    await resend.emails.send({
      from: "Ariane Siciliano <pesquisa@mzmwealth.com>",
      to: invite.clientEmail,
      subject: INVITE_SUBJECT,
      html: `<!DOCTYPE html><html><body style="margin:0;padding:24px;">${htmlBody}</body></html>`,
    });

    await prisma.surveyInvite.update({
      where: { id: invite.id },
      data: { sentAt: new Date(), sendStatus: "sent", sendError: null },
    });

    return { success: true, id: invite.id };
  } catch (err) {
    const errorMessage = err?.message || "Erro desconhecido ao enviar e-mail.";

    await prisma.surveyInvite.update({
      where: { id: invite.id },
      data: { sendStatus: "failed", sendError: errorMessage },
    });

    return { success: false, id: invite.id, error: errorMessage };
  }
}

export async function sendBulkInviteEmails(invites, requestOrigin) {
  const settled = await Promise.allSettled(
    invites.map((invite) => sendInviteEmail(invite, requestOrigin))
  );

  const results = settled.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { success: false, id: null, error: r.reason?.message }
  );

  const sent   = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return { results, summary: { total: invites.length, sent, failed } };
}
