export const dynamic = "force-dynamic";

import { getDashboardResponses } from "@/lib/data";
import { responseCsatPercent } from "@/lib/analytics";

function esc(value) {
  if (value == null) return "";
  const str = String(value).replace(/"/g, '""');
  return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str}"` : str;
}

export async function GET() {
  const responses = await getDashboardResponses();

  const headers = [
    "Sigla do Cliente",
    "Advisor responsável",
    "NPS",
    "CSAT",
  ];

  const rows = responses.map((r) => [
    esc(r.clientCode),
    esc(r.advisor),
    esc(r.npsScore),
    esc(responseCsatPercent(r)),
  ].join(","));

  const csv = [headers.join(","), ...rows].join("\n");

  return new Response("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mzm-respostas-salesforce-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
