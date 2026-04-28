import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { INVITE_SUBJECT } from "@/lib/survey";
import { getAppUrl } from "@/lib/data";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_DATA_URL = (() => {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public", "logo-mzm-email.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
})();

const ASSINATURA_DATA_URL = (() => {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public", "assinatura-email.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
})();

function buildInviteUrl(token, requestOrigin) {
  const base = requestOrigin || getAppUrl();
  return `${base}/survey/${token}`;
}

function buildEmailHtml(clientName, inviteUrl, requestOrigin) {
  const appUrl = requestOrigin || getAppUrl();
  const logoUrl = LOGO_DATA_URL || `${appUrl}/logo-mzm-email.png`;

  const bodyText = `Olá, ${clientName}.\n\nSou a Ariane, responsável pelo setor de Client Experience da MZM Wealth. Preparamos uma pesquisa breve para entender como você percebe nossa atuação e sua satisfação com a experiência consultiva.\n\nSeu retorno nos ajudará a evoluir continuamente o padrão de atendimento, a satisfação percebida e a experiência consultiva.\n\nVocê pode responder neste link:\n${inviteUrl}\n\nA pesquisa leva cerca de 3 minutos.\n\nMuito obrigada,`;

  const bodyHtml = bodyText
    .split("\n")
    .map((line) => `<p style="margin:0 0 8px 0;font-family:'Montserrat',Arial,sans-serif;font-size:15px;color:#1a1a1a;">${line || "&nbsp;"}</p>`)
    .join("");

  const signatureSrc = ASSINATURA_DATA_URL || `${appUrl}/assinatura-email.png`;
  const signature = `<br/><img src="${signatureSrc}" alt="Ariane Siciliano — MZM Wealth" width="600" style="display:block;border-radius:6px;" />`;

  return `<!DOCTYPE html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap');</style></head><body style="margin:0;padding:24px;">${bodyHtml}${signature}</body></html>`;
}

export async function sendInviteEmail(invite, requestOrigin) {
  const inviteUrl = buildInviteUrl(invite.token, requestOrigin);
  const html = buildEmailHtml(invite.clientName, inviteUrl, requestOrigin);

  try {
    await resend.emails.send({
      from: "Ariane Siciliano <pesquisa@mzmwealth.com>",
      to: invite.clientEmail,
      subject: INVITE_SUBJECT,
      html,
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
  const results = [];

  for (const invite of invites) {
    const result = await sendInviteEmail(invite, requestOrigin);
    results.push(result);
    // 600ms entre envios — respeita o limite de 2 e-mails/segundo do Resend
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  const sent   = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return { results, summary: { total: invites.length, sent, failed } };
}
