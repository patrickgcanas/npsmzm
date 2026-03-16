import { csatQuestions, pillarOrder } from "@/lib/survey";

export function getCsatValues(response) {
  return csatQuestions
    .map((question) => Number(response.csatAnswers?.[question.id]))
    .filter((value) => Number.isFinite(value) && value > 0);
}

export function responseCsatPercent(response) {
  const values = getCsatValues(response);
  if (!values.length) {
    return 0;
  }

  return Math.round((values.filter((value) => value >= 4).length / values.length) * 100);
}

export function computeMetrics(responses) {
  const total = responses.length;
  const allAnswers = responses.flatMap((response) => getCsatValues(response));
  const satisfiedAnswersCount = allAnswers.filter((value) => value >= 4).length;
  const averageCsat = allAnswers.length ? allAnswers.reduce((sum, value) => sum + value, 0) / allAnswers.length : 0;
  const promotersCount = responses.filter((response) => response.npsScore >= 9).length;
  const detractorsCount = responses.filter((response) => response.npsScore <= 6).length;
  const promoters = total ? Math.round((promotersCount / total) * 100) : 0;
  const detractors = total ? Math.round((detractorsCount / total) * 100) : 0;

  return {
    total,
    csat: allAnswers.length ? Math.round((satisfiedAnswersCount / allAnswers.length) * 100) : 0,
    satisfiedAnswers: allAnswers.length ? Math.round((satisfiedAnswersCount / allAnswers.length) * 100) : 0,
    averageCsat,
    promoters,
    detractors,
    nps: promoters - detractors,
  };
}

export function getScoreDistribution(responses) {
  const counts = Array.from({ length: 11 }, () => 0);
  responses.forEach((response) => {
    counts[response.npsScore] += 1;
  });
  return counts;
}

export function getPillarAverages(responses) {
  return pillarOrder.map((pillar) => {
    const pillarQuestions = csatQuestions.filter((question) => question.pillar === pillar.key);
    const values = responses.flatMap((response) =>
      pillarQuestions
        .map((question) => Number(response.csatAnswers?.[question.id]))
        .filter((value) => Number.isFinite(value) && value > 0)
    );
    const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

    return {
      ...pillar,
      average,
      percent: average ? (average / 5) * 100 : 0,
    };
  });
}

export function getTrendData(responses) {
  if (!responses.length) {
    return [];
  }

  const grouped = {};
  responses.forEach((response) => {
    const date = new Date(response.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(response);
  });

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, monthResponses]) => ({
      month,
      label: new Date(`${month}-01T12:00:00`).toLocaleDateString("pt-BR", {
        month: "short",
        year: "2-digit",
      }),
      csat: computeMetrics(monthResponses).csat,
    }));
}

export function getInsights(responses, metrics) {
  if (!responses.length) {
    return [
      {
        label: "Sem dados",
        text: "As respostas aparecerão aqui assim que a pesquisa começar a ser usada.",
      },
    ];
  }

  const comments = responses
    .flatMap((response) => [response.strengths, response.improvements, response.otherComments])
    .join(" ")
    .toLowerCase();

  return [
    {
      label: "Leitura CSAT",
      text:
        metrics.csat >= 85
          ? "A satisfação consolidada está forte, com predominância de avaliações 4 e 5 nos atributos medidos."
          : "O CSAT mostra espaço para elevar consistência operacional e percepção de valor em pontos críticos.",
    },
    {
      label: "Força percebida",
      text:
        comments.includes("segurança") || comments.includes("confiança")
          ? "Confiança e segurança seguem aparecendo como ativos centrais da relação com a MZM Wealth."
          : "Os comentários positivos reforçam a proposta consultiva e a proximidade no atendimento.",
    },
    {
      label: "Ponto de atenção",
      text:
        comments.includes("prazo") || comments.includes("tempo") || comments.includes("retorno")
          ? "Há sinal claro para acompanhar prazos, velocidade de retorno e previsibilidade do fluxo operacional."
          : "Vale monitorar ritmo de comunicação, frequência de acompanhamento e clareza da jornada consultiva.",
    },
  ];
}
