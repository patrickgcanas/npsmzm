import { getAllInvites } from "@/lib/data";

function esc(value) {
  if (value == null) return "";
  const str = String(value).replace(/"/g, '""');
  return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str}"` : str;
}

function statusLabel(invite) {
  if (invite.responded) return "Respondida";
  if (invite.startedAt) return "Em preenchimento";
  if (invite.viewedAt) return "Abriu o link";
  return "Não abriu";
}

export async function GET() {
  const invites = await getAllInvites();

  const headers = [
    "cliente", "email", "sigla", "advisor",
    "enviado_em", "visualizado_em", "iniciou_em", "respondeu_em", "status",
  ];

  const rows = invites.map((i) => [
    esc(i.clientName),
    esc(i.clientEmail),
    esc(i.clientCode),
    esc(i.advisor),
    esc(new Date(i.createdAt).toLocaleDateString("pt-BR")),
    esc(i.viewedAt ? new Date(i.viewedAt).toLocaleDateString("pt-BR") : ""),
    esc(i.startedAt ? new Date(i.startedAt).toLocaleDateString("pt-BR") : ""),
    esc(i.respondedAt ? new Date(i.respondedAt).toLocaleDateString("pt-BR") : ""),
    esc(statusLabel(i)),
  ].join(","));

  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mzm-convites-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
