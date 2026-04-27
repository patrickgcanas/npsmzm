export const dynamic = "force-dynamic";

import { getDashboardResponses } from "@/lib/data";
import { responseCsatPercent } from "@/lib/analytics";
import * as XLSX from "xlsx";

export async function GET() {
  const responses = await getDashboardResponses();

  const rows = [
    ["Sigla do Cliente", "Advisor responsável", "NPS", "CSAT"],
    ...responses.map((r) => [
      r.clientCode || "",
      r.advisor || "",
      r.npsScore,
      responseCsatPercent(r),
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook  = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Respostas");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const filename = `mzm-respostas-salesforce-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
