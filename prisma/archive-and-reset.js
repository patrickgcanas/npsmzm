require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const csatLabels = {
  contactEase: "Contato com o consultor",
  reportClarity: "Relatório mensal",
  modelTransparency: "Transparência do modelo",
  responseTime: "Tempo de retorno",
  planningFit: "Aderência do planejamento",
  interestAlignment: "Alinhamento de interesses",
  meetingFrequency: "Frequência das reuniões",
  solutionsSupport: "Soluções e operações",
  meetingClarity: "Clareza nas reuniões",
  engagement: "Engajamento",
  advisorRelevance: "Relevância do consultor",
};

const journeyLabels = {
  onboarding: "Onboarding recente",
  relacionamento: "Relacionamento recorrente",
};

function csvCell(value) {
  if (value === null || value === undefined) return '""';
  return `"${String(value).replace(/"/g, '""')}"`;
}

async function main() {
  const invites = await prisma.surveyInvite.findMany({
    include: { response: true },
    orderBy: { createdAt: "asc" },
  });

  if (!invites.length) {
    console.log("Nenhum registro encontrado. Nada a arquivar.");
    await prisma.$disconnect();
    return;
  }

  const header = [
    "Data do convite",
    "Data da resposta",
    "Status",
    "Cliente",
    "Email",
    "Advisor",
    "Etapa da jornada",
    "NPS",
    ...Object.values(csatLabels),
    "O que mais valoriza",
    "O que poderia melhorar",
    "Outros comentários",
  ];

  const rows = invites.map((invite) => {
    const r = invite.response;
    const status = r ? "Respondida" : "Não respondida";
    const dataConvite = new Date(invite.createdAt).toLocaleString("pt-BR");
    const dataResposta = r ? new Date(r.createdAt).toLocaleString("pt-BR") : "";
    const jornada = r ? (journeyLabels[r.journeyStage] || r.journeyStage) : "";

    return [
      csvCell(dataConvite),
      csvCell(dataResposta),
      csvCell(status),
      csvCell(invite.clientName),
      csvCell(invite.clientEmail || ""),
      csvCell(invite.advisor),
      csvCell(jornada),
      csvCell(r ? r.npsScore : ""),
      ...Object.keys(csatLabels).map((key) => csvCell(r ? r[key] : "")),
      csvCell(r ? r.strengths : ""),
      csvCell(r ? r.improvements : ""),
      csvCell(r ? r.otherComments : ""),
    ].join(",");
  });

  const csv = "﻿" + [header.map(csvCell).join(","), ...rows].join("\r\n");

  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  const filename = `historico_mzm_${stamp}.csv`;
  const outputPath = path.join(__dirname, "..", filename);

  fs.writeFileSync(outputPath, csv, "utf8");
  console.log(`Arquivo salvo: ${filename}`);
  console.log(`Total de registros: ${invites.length} (${invites.filter((i) => i.response).length} respondidas)`);

  await prisma.surveyResponse.deleteMany();
  await prisma.surveyInvite.deleteMany();
  console.log("Base limpa com sucesso.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Erro:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  });
