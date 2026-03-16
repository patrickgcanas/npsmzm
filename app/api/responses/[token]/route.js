import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { csatQuestions, journeyOptions } from "@/lib/survey";

function isValidScale(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max;
}

export async function POST(request, { params }) {
  try {
    const invite = await prisma.surveyInvite.findUnique({
      where: {
        token: params.token,
      },
      include: {
        response: true,
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Convite não encontrado." }, { status: 404 });
    }

    if (invite.response) {
      return NextResponse.json({ error: "Esta pesquisa já foi respondida." }, { status: 409 });
    }

    const body = await request.json();
    const npsScore = Number(body.npsScore);
    const journeyStage = body.journeyStage;
    const strengths = body.strengths?.trim() || "";
    const improvements = body.improvements?.trim() || "";
    const otherComments = body.otherComments?.trim() || "";
    const csatAnswers = body.csatAnswers || {};

    if (!isValidScale(npsScore, 0, 10)) {
      return NextResponse.json({ error: "Informe uma nota válida de NPS." }, { status: 400 });
    }

    if (!journeyOptions.some((option) => option.value === journeyStage)) {
      return NextResponse.json({ error: "Selecione uma jornada válida." }, { status: 400 });
    }

    for (const question of csatQuestions) {
      const value = Number(csatAnswers[question.id]);
      if (!isValidScale(value, 1, 5)) {
        return NextResponse.json({ error: "Preencha todas as respostas de CSAT." }, { status: 400 });
      }
    }

    const response = await prisma.surveyResponse.create({
      data: {
        inviteId: invite.id,
        npsScore,
        journeyStage,
        strengths,
        improvements,
        otherComments,
        ...Object.fromEntries(csatQuestions.map((question) => [question.id, Number(csatAnswers[question.id])])),
      },
    });

    return NextResponse.json({ id: response.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível registrar a resposta." }, { status: 500 });
  }
}
