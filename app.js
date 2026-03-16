const STORAGE_KEY = "mzm-wealth-csat-responses-v2";
const DEFAULT_VIEW = "home";
const views = ["home", "send", "survey", "dashboard"];
const advisors = [
  "Daniel Mazza",
  "Fabio Marques",
  "Mauro Cervellini",
  "Eduardo Zilli",
  "Patrick Cañas",
  "Renato Ormeni",
  "Emanuel Troya",
  "Carla Gonzalez",
];

const csatQuestions = [
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

const pillarOrder = [
  { key: "NA", label: "Nosso Atendimento" },
  { key: "NS", label: "Nosso Serviço" },
  { key: "NN", label: "Nosso Negócio" },
];

const demoResponses = [
  {
    id: generateId(),
    createdAt: "2026-01-18T14:30:00-03:00",
    clientName: "Família Andrade",
    clientEmail: "andrade@example.com",
    advisor: "Daniel Mazza",
    npsScore: 10,
    csatAnswers: {
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
    strengths: "A equipe transmite muita segurança e entende o contexto patrimonial da família.",
    improvements: "Gostaria de receber um resumo executivo mensal ainda mais visual.",
    otherComments: "A experiência é muito próxima do que esperamos de um multi family office.",
    journeyStage: "relacionamento",
    allowContact: true,
  },
  {
    id: generateId(),
    createdAt: "2026-01-27T10:10:00-03:00",
    clientName: "Carlos e Helena Nunes",
    clientEmail: "nunes@example.com",
    advisor: "Fabio Marques",
    npsScore: 8,
    csatAnswers: {
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
    strengths: "O planejamento foi muito claro e a comunicação durante o processo foi consistente.",
    improvements: "Poderiam reduzir o tempo entre a reunião e o envio das recomendações finais.",
    otherComments: "",
    journeyStage: "planejamento",
    allowContact: true,
  },
  {
    id: generateId(),
    createdAt: "2026-02-09T16:20:00-03:00",
    clientName: "Grupo Ferraz",
    clientEmail: "ferraz@example.com",
    advisor: "Patrick Cañas",
    npsScore: 9,
    csatAnswers: {
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
    strengths: "Conseguimos alinhar decisões do negócio e do patrimônio pessoal com muito mais clareza.",
    improvements: "Seria útil ampliar a frequência das reuniões de acompanhamento no trimestre.",
    otherComments: "",
    journeyStage: "relacionamento",
    allowContact: false,
  },
  {
    id: generateId(),
    createdAt: "2026-02-21T11:45:00-03:00",
    clientName: "Renata Albuquerque",
    clientEmail: "renata@example.com",
    advisor: "Renato Ormeni",
    npsScore: 6,
    csatAnswers: {
      contactEase: 3,
      reportClarity: 4,
      modelTransparency: 4,
      responseTime: 3,
      planningFit: 4,
      interestAlignment: 4,
      meetingFrequency: 3,
      solutionsSupport: 4,
      meetingClarity: 3,
      engagement: 3,
      advisorRelevance: 4,
    },
    strengths: "A profundidade técnica foi muito positiva e trouxe conforto para avançar no tema sucessório.",
    improvements: "Gostaria de mais previsibilidade de prazo em cada etapa do projeto.",
    otherComments: "Uma visão mais clara de cronograma ajudaria muito.",
    journeyStage: "sucessao",
    allowContact: true,
  },
  {
    id: generateId(),
    createdAt: "2026-03-03T09:15:00-03:00",
    clientName: "Família Pires",
    clientEmail: "pires@example.com",
    advisor: "Carla Gonzalez",
    npsScore: 10,
    csatAnswers: {
      contactEase: 5,
      reportClarity: 5,
      modelTransparency: 5,
      responseTime: 5,
      planningFit: 5,
      interestAlignment: 5,
      meetingFrequency: 4,
      solutionsSupport: 5,
      meetingClarity: 5,
      engagement: 5,
      advisorRelevance: 5,
    },
    strengths: "A proximidade do time e a capacidade de traduzir temas complexos nos deixam muito tranquilos.",
    improvements: "",
    otherComments: "O padrão de atendimento é muito consistente.",
    journeyStage: "onboarding",
    allowContact: false,
  },
];

const state = {
  inviteLink: "",
  responses: loadResponses(),
};

const elements = {
  heroMetrics: document.getElementById("hero-metrics"),
  dashboardMetrics: document.getElementById("dashboard-metrics"),
  scoreChart: document.getElementById("score-chart"),
  pillarChart: document.getElementById("pillar-chart"),
  trendChart: document.getElementById("trend-chart"),
  insightsPanel: document.getElementById("insights-panel"),
  responsesTable: document.getElementById("responses-table"),
  npsSummary: document.getElementById("nps-summary"),
  lastUpdated: document.getElementById("last-updated"),
  filterAdvisor: document.getElementById("filter-advisor"),
  filterSearch: document.getElementById("filter-search"),
  inviteForm: document.getElementById("invite-form"),
  inviteStatus: document.getElementById("invite-status"),
  inviteUrl: document.getElementById("invite-url"),
  inviteMessage: document.getElementById("invite-message"),
  emailLink: document.getElementById("email-link"),
  surveyForm: document.getElementById("survey-form"),
  surveySuccess: document.getElementById("survey-success"),
  surveyContext: document.getElementById("survey-context"),
  surveyIntro: document.getElementById("survey-intro"),
  csatQuestions: document.getElementById("csat-questions"),
  surveySubmitWrap: document.getElementById("survey-submit-wrap"),
  surveyPreviewNote: document.getElementById("survey-preview-note"),
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  seedResponsesIfNeeded();
  buildScoreOptions();
  buildCsatQuestions();
  populateFilterOptions();
  bindNavigation();
  bindActions();
  hydrateSurveyFromUrl();
  renderAll();
  setView(readViewFromUrl(), false);
}

function generateId() {
  if (window.crypto && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadResponses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveResponses() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.responses));
  } catch (error) {
    return;
  }
}

function seedResponsesIfNeeded() {
  if (state.responses.length) {
    return;
  }

  state.responses = [...demoResponses];
  saveResponses();
}

function bindNavigation() {
  document.querySelectorAll("[data-view-link]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const view = button.getAttribute("data-view-link");
      setView(view, true);
    });
  });

  window.addEventListener("popstate", () => {
    hydrateSurveyFromUrl();
    setView(readViewFromUrl(), false);
  });
}

function bindActions() {
  document.getElementById("generate-link").addEventListener("click", generateInvite);
  document.getElementById("preview-link").addEventListener("click", previewInvite);
  document.getElementById("copy-link").addEventListener("click", () => copyText(elements.inviteUrl.value));
  document.getElementById("copy-message").addEventListener("click", () => copyText(elements.inviteMessage.value));
  document.getElementById("export-json").addEventListener("click", exportJson);
  document.getElementById("export-csv").addEventListener("click", exportCsv);
  document.getElementById("load-demo").addEventListener("click", () => {
    state.responses = [...demoResponses];
    saveResponses();
    renderAll();
  });
  document.getElementById("new-response").addEventListener("click", resetSurvey);

  elements.filterAdvisor.addEventListener("change", renderAll);
  elements.filterSearch.addEventListener("input", renderAll);

  elements.surveyForm.addEventListener("submit", submitSurvey);
}

function readViewFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  return views.includes(view) ? view : DEFAULT_VIEW;
}

function setView(view, pushState = true) {
  const nextView = views.includes(view) ? view : DEFAULT_VIEW;
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("is-active", section.dataset.view === nextView);
  });
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewLink === nextView);
  });

  if (pushState) {
    const url = new URL(window.location.href);
    url.searchParams.set("view", nextView);
    window.history.pushState({}, "", url);
    hydrateSurveyFromUrl();
  }
}

function populateFilterOptions() {
  advisors.forEach((advisor) => {
    elements.filterAdvisor.add(new Option(advisor, advisor));
  });
}

function buildScoreOptions() {
  const scoreGrid = document.getElementById("score-grid");
  scoreGrid.innerHTML = "";

  Array.from({ length: 11 }, (_, score) => {
    const label = document.createElement("label");
    label.className = "score-option";
    label.innerHTML = `
      <input type="radio" name="npsScore" value="${score}" required />
      <span>${score}</span>
    `;
    scoreGrid.appendChild(label);
  });
}

function buildCsatQuestions() {
  elements.csatQuestions.innerHTML = csatQuestions
    .map(
      (question) => `
        <article class="csat-card">
          <div class="question-meta">
            <span class="question-number">${question.number}</span>
            <span class="pillar-pill">${question.pillar} · ${question.pillarLabel}</span>
          </div>
          <p class="question-prompt">${question.prompt}</p>
          <div class="csat-scale" role="radiogroup" aria-label="${escapeHtml(question.prompt)}">
            ${Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              return `
                <label class="csat-option">
                  <input type="radio" name="${question.id}" value="${value}" ${value === 1 ? "required" : ""} />
                  <span>${value}</span>
                </label>
              `;
            }).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function generateInvite() {
  const formData = new FormData(elements.inviteForm);
  const clientName = (formData.get("clientName") || "").toString().trim();
  const clientEmail = (formData.get("clientEmail") || "").toString().trim();
  const advisor = (formData.get("advisor") || advisors[0]).toString();
  const relationshipNote = (formData.get("relationshipNote") || "").toString().trim();

  if (!clientName) {
    elements.inviteStatus.textContent = "Informe o cliente";
    return;
  }

  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("view", "survey");
  url.searchParams.set("client", clientName);
  url.searchParams.set("advisor", advisor);

  if (clientEmail) {
    url.searchParams.set("email", clientEmail);
  }

  state.inviteLink = url.toString();
  elements.inviteUrl.value = state.inviteLink;
  elements.inviteStatus.textContent = "Link pronto";

  const noteLine = relationshipNote
    ? `Considerando nosso contexto recente (${relationshipNote}), seu retorno nos ajudará a aprimorar ainda mais a experiência.`
    : "Seu retorno nos ajudará a evoluir continuamente o padrão de atendimento, a satisfação percebida e a experiência consultiva.";

  const message = `Olá, ${clientName}.\n\nAqui é a equipe da MZM Wealth. Preparamos uma pesquisa breve para entender como você percebe nossa atuação e sua satisfação com a experiência consultiva.\n\n${noteLine}\n\nVocê pode responder neste link:\n${state.inviteLink}\n\nA pesquisa leva cerca de 3 minutos.\n\nMuito obrigado,\n${advisor}\nMZM Wealth`;

  elements.inviteMessage.value = message;
  elements.emailLink.href = createMailtoLink(clientEmail, message);
}

function previewInvite() {
  if (!state.inviteLink) {
    generateInvite();
  }

  if (!state.inviteLink) {
    return;
  }

  window.location.href = state.inviteLink;
}

function createMailtoLink(email, message) {
  const recipient = email ? encodeURIComponent(email) : "";
  return `mailto:${recipient}?subject=${encodeURIComponent(
    "Pesquisa de satisfação | MZM Wealth"
  )}&body=${encodeURIComponent(message)}`;
}

async function copyText(value) {
  if (!value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    const temp = document.createElement("textarea");
    temp.value = value;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  }
}

function hydrateSurveyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const client = params.get("client");
  const advisor = params.get("advisor");
  const email = params.get("email");
  const hasInviteContext = Boolean(client && advisor);

  const pills = [];
  if (client) pills.push(`Cliente: ${client}`);
  if (advisor) pills.push(`Advisor: ${advisor}`);

  elements.surveyContext.innerHTML = pills.length
    ? pills.map((pill) => `<span class="context-pill">${escapeHtml(pill)}</span>`).join("")
    : `<span class="context-pill">Resposta aberta</span>`;

  elements.surveyIntro.textContent = client
    ? `${client}, sua percepção é essencial para evoluirmos a satisfação e a experiência consultiva da MZM Wealth.`
    : "Sua percepção é essencial para evoluirmos a satisfação e a experiência consultiva oferecida aos nossos clientes.";

  if (email) {
    elements.surveyForm.dataset.email = email;
  } else {
    delete elements.surveyForm.dataset.email;
  }

  elements.surveyForm.dataset.client = client || "";
  elements.surveyForm.dataset.advisor = advisor || "";
  elements.surveySubmitWrap.classList.toggle("hidden", !hasInviteContext);
  elements.surveyPreviewNote.classList.toggle("hidden", hasInviteContext);

  if (!hasInviteContext) {
    elements.surveyForm.classList.remove("hidden");
    elements.surveySuccess.classList.add("hidden");
  }
}

function submitSurvey(event) {
  event.preventDefault();

  const formData = new FormData(elements.surveyForm);
  const csatAnswers = {};
  csatQuestions.forEach((question) => {
    csatAnswers[question.id] = Number(formData.get(question.id));
  });

  const response = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    clientName: elements.surveyForm.dataset.client || "Cliente sem identificação",
    clientEmail: elements.surveyForm.dataset.email || "",
    advisor: elements.surveyForm.dataset.advisor || "Não informado",
    npsScore: Number(formData.get("npsScore")),
    csatAnswers,
    strengths: (formData.get("strengths") || "").toString().trim(),
    improvements: (formData.get("improvements") || "").toString().trim(),
    otherComments: (formData.get("otherComments") || "").toString().trim(),
    journeyStage: (formData.get("journeyStage") || "").toString(),
    allowContact: false,
  };

  state.responses = [response, ...state.responses];
  saveResponses();
  renderAll();

  elements.surveyForm.classList.add("hidden");
  elements.surveySuccess.classList.remove("hidden");
  setView("survey", true);
}

function resetSurvey() {
  elements.surveyForm.reset();
  elements.surveyForm.classList.remove("hidden");
  elements.surveySuccess.classList.add("hidden");
}

function getFilteredResponses() {
  const advisor = elements.filterAdvisor.value;
  const search = elements.filterSearch.value.trim().toLowerCase();

  return state.responses.filter((response) => {
    const advisorMatch = advisor === "all" || response.advisor === advisor;
    const searchTarget = [
      response.clientName,
      response.strengths,
      response.improvements,
      response.otherComments,
    ]
      .join(" ")
      .toLowerCase();
    const searchMatch = !search || searchTarget.includes(search);

    return advisorMatch && searchMatch;
  });
}

function renderAll() {
  renderHeroMetrics();
  renderDashboard();
}

function renderHeroMetrics() {
  const metrics = computeMetrics(state.responses);
  elements.heroMetrics.innerHTML = [
    createMetricCard("CSAT geral", `${metrics.csat}%`, `${metrics.satisfiedAnswers}% de respostas 4 ou 5`),
    createMetricCard("NPS relacional", formatSigned(metrics.nps), `${metrics.promoters}% promotores`),
    createMetricCard("Respostas", String(metrics.total), "Base local da pesquisa"),
  ].join("");
}

function renderDashboard() {
  const filtered = getFilteredResponses();
  const metrics = computeMetrics(filtered);

  elements.dashboardMetrics.innerHTML = [
    createMetricCard("CSAT geral", `${metrics.csat}%`, `${metrics.satisfiedAnswers}% de avaliações satisfeitas`),
    createMetricCard("Média CSAT", metrics.averageCsat.toFixed(1), "Escala de 1 a 5"),
    createMetricCard("NPS", formatSigned(metrics.nps), `${metrics.promoters}% promotores | ${metrics.detractors}% detratores`),
    createMetricCard("Base ativa", String(metrics.total), "Respostas filtradas"),
  ].join("");

  elements.npsSummary.textContent = `${metrics.total} resposta${metrics.total === 1 ? "" : "s"}`;
  elements.lastUpdated.textContent = `Atualizado em ${new Date().toLocaleString("pt-BR")}`;

  renderScoreChart(filtered);
  renderPillarChart(filtered);
  renderTrendChart(filtered);
  renderInsights(filtered, metrics);
  renderResponsesTable(filtered);
}

function createMetricCard(label, value, caption) {
  return `
    <article class="metric-card">
      <span class="metric-label">${label}</span>
      <span class="metric-value">${value}</span>
      <span class="metric-caption">${caption}</span>
    </article>
  `;
}

function computeMetrics(responses) {
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

function getCsatValues(response) {
  return csatQuestions
    .map((question) => Number(response.csatAnswers?.[question.id]))
    .filter((value) => Number.isFinite(value) && value > 0);
}

function responseCsatPercent(response) {
  const values = getCsatValues(response);
  if (!values.length) {
    return 0;
  }

  return Math.round((values.filter((value) => value >= 4).length / values.length) * 100);
}

function renderScoreChart(responses) {
  const counts = Array.from({ length: 11 }, () => 0);
  responses.forEach((response) => {
    counts[response.npsScore] += 1;
  });

  const max = Math.max(...counts, 1);
  elements.scoreChart.innerHTML = `
    <div class="bar-chart">
      ${counts
        .map((count, score) => {
          const height = Math.max((count / max) * 160, count ? 20 : 10);
          return `
            <div class="bar-col">
              <span class="bar-value">${count}</span>
              <div class="bar" style="height:${height}px"></div>
              <span class="bar-label">${score}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPillarChart(responses) {
  const markup = pillarOrder
    .map((pillar) => {
      const pillarQuestions = csatQuestions.filter((question) => question.pillar === pillar.key);
      const values = responses.flatMap((response) =>
        pillarQuestions
          .map((question) => Number(response.csatAnswers?.[question.id]))
          .filter((value) => Number.isFinite(value) && value > 0)
      );
      const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
      const percent = (average / 5) * 100;
      return `
        <div class="pillar-row">
          <span>${pillar.label}</span>
          <div class="pillar-track">
            <div class="pillar-fill" style="width:${percent}%"></div>
          </div>
          <strong>${average.toFixed(1)}</strong>
        </div>
      `;
    })
    .join("");

  elements.pillarChart.innerHTML = `<div class="pillar-bars">${markup}</div>`;
}

function renderTrendChart(responses) {
  if (!responses.length) {
    elements.trendChart.innerHTML = `<p class="muted">Sem dados suficientes para a série histórica.</p>`;
    return;
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

  const entries = Object.entries(grouped)
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

  const width = 760;
  const height = 260;
  const paddingX = 42;
  const paddingY = 28;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;
  const steps = Math.max(entries.length - 1, 1);

  const points = entries.map((entry, index) => {
    const x = paddingX + (usableWidth / steps) * index;
    const y = paddingY + usableHeight - (entry.csat / 100) * usableHeight;
    return { ...entry, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(height - paddingY).toFixed(1)} L ${
    points[0].x
  } ${(height - paddingY).toFixed(1)} Z`;

  const gridLines = Array.from({ length: 5 }, (_, index) => {
    const value = index * 25;
    const y = paddingY + usableHeight - (value / 100) * usableHeight;
    return `<line class="trend-grid-line" x1="${paddingX}" x2="${width - paddingX}" y1="${y}" y2="${y}" />`;
  }).join("");

  const pointMarkup = points
    .map(
      (point) => `
        <circle class="trend-point" cx="${point.x}" cy="${point.y}" r="6" />
        <text class="trend-label" x="${point.x}" y="${height - 8}" text-anchor="middle">${point.label}</text>
      `
    )
    .join("");

  elements.trendChart.innerHTML = `
    <svg class="trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Evolução mensal do CSAT">
      ${gridLines}
      <path class="trend-area" d="${areaPath}"></path>
      <path class="trend-line" d="${linePath}"></path>
      ${pointMarkup}
    </svg>
  `;
}

function renderInsights(responses, metrics) {
  if (!responses.length) {
    elements.insightsPanel.innerHTML =
      `<div class="insight-chip"><strong>Sem dados</strong><span>As respostas aparecerão aqui assim que a pesquisa começar a ser usada.</span></div>`;
    return;
  }

  const comments = responses
    .flatMap((response) => [response.strengths, response.improvements, response.otherComments])
    .join(" ")
    .toLowerCase();

  const signals = [
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

  elements.insightsPanel.innerHTML = signals
    .map(
      (signal) => `
        <div class="insight-chip">
          <strong>${signal.label}</strong>
          <span>${signal.text}</span>
        </div>
      `
    )
    .join("");
}

function renderResponsesTable(responses) {
  if (!responses.length) {
    elements.responsesTable.innerHTML = `
      <tr>
        <td colspan="5" class="muted">Nenhuma resposta encontrada para os filtros aplicados.</td>
      </tr>
    `;
    return;
  }

  elements.responsesTable.innerHTML = responses
    .slice(0, 8)
    .map((response) => {
      const comment = response.improvements || response.otherComments || response.strengths || "Sem comentário";
      return `
        <tr>
          <td>${escapeHtml(response.clientName)}</td>
          <td>${escapeHtml(response.advisor)}</td>
          <td>${responseCsatPercent(response)}%</td>
          <td>${response.npsScore}</td>
          <td>${escapeHtml(comment)}</td>
        </tr>
      `;
    })
    .join("");
}

function exportJson() {
  downloadFile("mzm-wealth-csat.json", JSON.stringify(state.responses, null, 2), "application/json");
}

function exportCsv() {
  const header = [
    "createdAt",
    "clientName",
    "clientEmail",
    "advisor",
    "npsScore",
    ...csatQuestions.map((question) => question.id),
    "strengths",
    "improvements",
    "otherComments",
    "journeyStage",
    "allowContact",
  ];

  const lines = [header.join(",")].concat(
    state.responses.map((response) =>
      header
        .map((field) => {
          const value = field in response ? response[field] : response.csatAnswers?.[field] ?? "";
          const safe = String(value).replace(/"/g, '""');
          return `"${safe}"`;
        })
        .join(",")
    )
  );

  downloadFile("mzm-wealth-csat.csv", lines.join("\n"), "text/csv;charset=utf-8");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatSigned(value) {
  return value > 0 ? `+${value}` : String(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

