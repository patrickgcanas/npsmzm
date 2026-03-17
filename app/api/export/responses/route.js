import { getDashboardResponses } from "@/lib/data";
import { getPillarAverages, responseCsatPercent } from "@/lib/analytics";

function esc(value) {
  if (value == null) return "";
  const str = String(value).replace(/"/g, '""');
  return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str}"` : str;
}

export async function GET() {
  const responses = await getDashboardResponses();

  const headers = [
    "cliente", "email", "sigla", "advisor", "etapa_jornada", "data_resposta",
    "nps", "csat_pct", "media_csat",
    "na_atendimento_media", "ns_servico_media", "nn_negocio_media",
    "pontos_fortes", "melhorias", "outros_comentarios",
  ];

  const rows = responses.map((r) => {
    const pillars = getPillarAverages([r]);
    const na = pillars.find((p) => p.key === "NA")?.average ?? 0;
    const ns = pillars.find((p) => p.key === "NS")?.average ?? 0;
    const nn = pillars.find((p) => p.key === "NN")?.average ?? 0;

    return [
      esc(r.clientName),
      esc(r.clientEmail),
      esc(""),        // sigla not stored on response, only on invite
      esc(r.advisor),
      esc(r.journeyStage),
      esc(new Date(r.createdAt).toLocaleDateString("pt-BR")),
      esc(r.npsScore),
      esc(responseCsatPercent(r)),
      esc(getPillarAverages([r]).length ? (r.csatAnswers ? Object.values(r.csatAnswers).reduce((a, b) => a + b, 0) / Object.values(r.csatAnswers).filter(Boolean).length : 0).toFixed(2) : ""),
      esc(na.toFixed(2)),
      esc(ns.toFixed(2)),
      esc(nn.toFixed(2)),
      esc(r.strengths),
      esc(r.improvements),
      esc(r.otherComments),
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mzm-respostas-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
