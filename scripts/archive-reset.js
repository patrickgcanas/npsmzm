require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const CSAT_FIELDS = [
  "contactEase", "reportClarity", "modelTransparency", "responseTime",
  "planningFit", "interestAlignment", "meetingFrequency", "solutionsSupport",
  "meetingClarity", "engagement", "advisorRelevance",
];

function csatPercent(response) {
  const values = CSAT_FIELDS.map((f) => response[f]).filter((v) => v > 0);
  if (!values.length) return 0;
  return Math.round((values.filter((v) => v >= 4).length / values.length) * 100);
}

function statusLabel(invite) {
  if (invite.response) return "Respondida";
  if (invite.startedAt) return "Em preenchimento";
  if (invite.viewedAt) return "Abriu o link";
  if (invite.sentAt) return "Enviado";
  return "Aguardando envio";
}

function fmt(date) {
  return date ? new Date(date).toLocaleDateString("pt-BR") : "";
}

async function main() {
  const invites = await prisma.surveyInvite.findMany({
    where: { deletedAt: null },
    include: { response: true },
    orderBy: { createdAt: "asc" },
  });

  const responded = invites.filter((i) => i.response);

  console.log(`\nCiclo atual:`);
  console.log(`  Total de convites : ${invites.length}`);
  console.log(`  Respondidos       : ${responded.length}`);
  console.log(`  Taxa de resposta  : ${invites.length ? Math.round((responded.length / invites.length) * 100) : 0}%\n`);

  // ── Aba 1: ciclo completo ─────────────────────────────────────────
  const sheetCiclo = [
    ["Cliente", "Sigla", "E-mail", "Advisor", "Status", "Criado em", "Enviado em", "Abriu em", "Respondeu em", "NPS", "CSAT (%)"],
    ...invites.map((i) => [
      i.clientName,
      i.clientCode || "",
      i.clientEmail || "",
      i.advisor,
      statusLabel(i),
      fmt(i.createdAt),
      fmt(i.sentAt),
      fmt(i.viewedAt),
      i.response ? fmt(i.response.createdAt) : "",
      i.response ? i.response.npsScore : "",
      i.response ? csatPercent(i.response) : "",
    ]),
  ];

  // ── Aba 2: Salesforce ─────────────────────────────────────────────
  const sheetSalesforce = [
    ["Sigla do Cliente", "Advisor responsável", "NPS", "CSAT"],
    ...responded.map((i) => [
      i.clientCode || "",
      i.advisor,
      i.response.npsScore,
      csatPercent(i.response),
    ]),
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheetCiclo), "Ciclo Completo");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheetSalesforce), "Salesforce");

  const archiveDir = path.join(process.cwd(), "data", "archives");
  const date = new Date().toISOString().slice(0, 10);
  const filePath = path.join(archiveDir, `ciclo-${date}.xlsx`);

  XLSX.writeFile(wb, filePath);
  console.log(`Arquivo salvo em: data/archives/ciclo-${date}.xlsx`);

  // ── Reset ─────────────────────────────────────────────────────────
  const { count } = await prisma.surveyInvite.updateMany({
    where: { deletedAt: null },
    data: { deletedAt: new Date() },
  });

  console.log(`\nReset concluído: ${count} convite(s) arquivado(s) no banco.`);
  console.log("Base limpa e pronta para o próximo ciclo.\n");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("Erro:", err.message);
    prisma.$disconnect();
    process.exit(1);
  });
