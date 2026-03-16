require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const demoInvites = [
  {
    token: "familia-andrade-demo",
    clientName: "Família Andrade",
    clientEmail: "andrade@example.com",
    advisor: "Daniel Mazza",
    relationshipNote: "Família com rotina recorrente de acompanhamento patrimonial.",
    response: {
      createdAt: new Date("2026-01-18T14:30:00-03:00"),
      npsScore: 10,
      journeyStage: "relacionamento",
      strengths: "A equipe transmite muita segurança e entende o contexto patrimonial da família.",
      improvements: "Gostaria de receber um resumo executivo mensal ainda mais visual.",
      otherComments: "A experiência é muito próxima do que esperamos de um multi family office.",
      contactEase: 5,
      reportClarity: 5,
      modelTransparency: 5,
      responseTime: 4,
      planningFit: 5,
      interestAlignment: 5,
      meetingFrequency: 4,
      solutionsSupport: 5,
      meetingClarity: 5,
      engagement: 4,
      advisorRelevance: 5,
    },
  },
  {
    token: "carlos-helena-nunes-demo",
    clientName: "Carlos e Helena Nunes",
    clientEmail: "nunes@example.com",
    advisor: "Fabio Marques",
    relationshipNote: "Pesquisa enviada após revisão semestral do planejamento.",
    response: {
      createdAt: new Date("2026-01-27T10:10:00-03:00"),
      npsScore: 8,
      journeyStage: "relacionamento",
      strengths: "O planejamento foi muito claro e a comunicação durante o processo foi consistente.",
      improvements: "Poderiam reduzir o tempo entre a reunião e o envio das recomendações finais.",
      otherComments: "",
      contactEase: 4,
      reportClarity: 4,
      modelTransparency: 4,
      responseTime: 3,
      planningFit: 4,
      interestAlignment: 4,
      meetingFrequency: 4,
      solutionsSupport: 4,
      meetingClarity: 4,
      engagement: 4,
      advisorRelevance: 4,
    },
  },
  {
    token: "grupo-ferraz-demo",
    clientName: "Grupo Ferraz",
    clientEmail: "ferraz@example.com",
    advisor: "Patrick Cañas",
    relationshipNote: "Cliente recorrente com temas empresariais e patrimoniais.",
    response: {
      createdAt: new Date("2026-02-09T16:20:00-03:00"),
      npsScore: 9,
      journeyStage: "relacionamento",
      strengths: "Conseguimos alinhar decisões do negócio e do patrimônio pessoal com muito mais clareza.",
      improvements: "Seria útil ampliar a frequência das reuniões de acompanhamento no trimestre.",
      otherComments: "",
      contactEase: 5,
      reportClarity: 4,
      modelTransparency: 5,
      responseTime: 4,
      planningFit: 4,
      interestAlignment: 5,
      meetingFrequency: 4,
      solutionsSupport: 4,
      meetingClarity: 5,
      engagement: 4,
      advisorRelevance: 5,
    },
  },
];

async function main() {
  for (const invite of demoInvites) {
    await prisma.surveyInvite.upsert({
      where: {
        token: invite.token,
      },
      update: {
        clientName: invite.clientName,
        clientEmail: invite.clientEmail,
        advisor: invite.advisor,
        relationshipNote: invite.relationshipNote,
      },
      create: {
        token: invite.token,
        clientName: invite.clientName,
        clientEmail: invite.clientEmail,
        advisor: invite.advisor,
        relationshipNote: invite.relationshipNote,
        response: {
          create: invite.response,
        },
      },
      include: {
        response: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
