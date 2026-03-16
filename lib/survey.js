export const advisors = [
  "Daniel Mazza",
  "Fabio Marques",
  "Mauro Cervellini",
  "Eduardo Zilli",
  "Patrick Cañas",
  "Renato Ormeni",
  "Emanuel Troya",
  "Carla Gonzalez",
];

export const journeyOptions = [
  { value: "onboarding", label: "Onboarding recente" },
  { value: "relacionamento", label: "Relacionamento recorrente" },
];

export const csatQuestions = [
  {
    id: "contactEase",
    number: 2,
    pillar: "NA",
    pillarLabel: "Nosso Atendimento",
    shortLabel: "Contato com o consultor",
    prompt: "Facilidade de contato com meu consultor quando necessário.",
  },
  {
    id: "reportClarity",
    number: 3,
    pillar: "NS",
    pillarLabel: "Nosso Serviço",
    shortLabel: "Relatório mensal",
    prompt: "Clareza, utilidade e relevância do relatório mensal.",
  },
  {
    id: "modelTransparency",
    number: 4,
    pillar: "NN",
    pillarLabel: "Nosso Negócio",
    shortLabel: "Transparência do modelo",
    prompt: "Transparência e compreensão do modelo de consultoria.",
  },
  {
    id: "responseTime",
    number: 5,
    pillar: "NA",
    pillarLabel: "Nosso Atendimento",
    shortLabel: "Tempo de retorno",
    prompt: "Tempo de retorno do time de operações às minhas demandas.",
  },
  {
    id: "planningFit",
    number: 6,
    pillar: "NS",
    pillarLabel: "Nosso Serviço",
    shortLabel: "Aderência do planejamento",
    prompt: "Aderência do planejamento financeiro ao meu momento de vida.",
  },
  {
    id: "interestAlignment",
    number: 7,
    pillar: "NN",
    pillarLabel: "Nosso Negócio",
    shortLabel: "Alinhamento de interesses",
    prompt: "Alinhamento de interesses entre a MZM Wealth e meus objetivos.",
  },
  {
    id: "meetingFrequency",
    number: 8,
    pillar: "NA",
    pillarLabel: "Nosso Atendimento",
    shortLabel: "Frequência das reuniões",
    prompt: "Frequência das reuniões de acompanhamento.",
  },
  {
    id: "solutionsSupport",
    number: 9,
    pillar: "NS",
    pillarLabel: "Nosso Serviço",
    shortLabel: "Soluções e operações",
    prompt: "Soluções apresentadas e suporte do time de operações.",
  },
  {
    id: "meetingClarity",
    number: 10,
    pillar: "NA",
    pillarLabel: "Nosso Atendimento",
    shortLabel: "Clareza nas reuniões",
    prompt: "Clareza e didática das explicações nas reuniões.",
  },
  {
    id: "engagement",
    number: 11,
    pillar: "NN",
    pillarLabel: "Nosso Negócio",
    shortLabel: "Engajamento",
    prompt: "Engajamento e participação nas etapas da consultoria.",
  },
  {
    id: "advisorRelevance",
    number: 12,
    pillar: "NA",
    pillarLabel: "Nosso Atendimento",
    shortLabel: "Relevância do consultor",
    prompt: "Relevância ativa do consultor nas decisões da minha vida financeira.",
  },
];

export const pillarOrder = [
  { key: "NA", label: "Nosso Atendimento" },
  { key: "NS", label: "Nosso Serviço" },
  { key: "NN", label: "Nosso Negócio" },
];

export function buildInviteMessage({ clientName, advisor, inviteUrl, relationshipNote }) {
  const noteLine = relationshipNote
    ? `Considerando nosso contexto recente (${relationshipNote}), seu retorno nos ajudará a aprimorar ainda mais a experiência.`
    : "Seu retorno nos ajudará a evoluir continuamente o padrão de atendimento, a satisfação percebida e a experiência consultiva.";

  return `Olá, ${clientName}.\n\nAqui é a equipe da MZM Wealth. Preparamos uma pesquisa breve para entender como você percebe nossa atuação e sua satisfação com a experiência consultiva.\n\n${noteLine}\n\nVocê pode responder neste link:\n${inviteUrl}\n\nA pesquisa leva cerca de 3 minutos.\n\nMuito obrigado,\n${advisor}\nMZM Wealth`;
}

export function getEmptySurveyPayload() {
  return {
    npsScore: "",
    journeyStage: journeyOptions[0].value,
    strengths: "",
    improvements: "",
    otherComments: "",
    ...Object.fromEntries(csatQuestions.map((question) => [question.id, ""])),
  };
}
