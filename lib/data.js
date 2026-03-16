import { prisma } from "@/lib/prisma";
import { csatQuestions } from "@/lib/survey";

function mapResponse(record) {
  return {
    id: record.id,
    createdAt: record.createdAt.toISOString(),
    clientName: record.invite.clientName,
    clientEmail: record.invite.clientEmail || "",
    advisor: record.invite.advisor,
    relationshipNote: record.invite.relationshipNote || "",
    journeyStage: record.journeyStage,
    npsScore: record.npsScore,
    strengths: record.strengths,
    improvements: record.improvements,
    otherComments: record.otherComments,
    token: record.invite.token,
    csatAnswers: Object.fromEntries(
      csatQuestions.map((question) => [question.id, Number(record[question.id])])
    ),
  };
}

export async function getDashboardResponses() {
  const records = await prisma.surveyResponse.findMany({
    include: {
      invite: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return records.map(mapResponse);
}

export async function getHomeSummary() {
  const responses = await getDashboardResponses();
  return responses;
}

export async function getInviteByToken(token) {
  return prisma.surveyInvite.findUnique({
    where: { token },
    include: {
      response: true,
    },
  });
}

export function getAppUrl() {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
