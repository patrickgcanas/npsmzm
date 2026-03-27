"use client";

import { useMemo, useState } from "react";
import {
  computeMetrics,
  getInsights,
  getPillarAverages,
  getScoreDistribution,
  getTrendData,
  responseCsatPercent,
} from "@/lib/analytics";
import { advisors, csatQuestions } from "@/lib/survey";
import { MetricCard } from "@/components/metric-card";

function formatSigned(value) {
  return value > 0 ? `+${value}` : String(value);
}

function ScoreChart({ responses }) {
  const counts = getScoreDistribution(responses);
  const max = Math.max(...counts, 1);

  return (
    <div className="bar-chart">
      {counts.map((count, score) => {
        const height = Math.max((count / max) * 160, count ? 20 : 10);
        return (
          <div className="bar-col" key={score}>
            <span className="bar-value">{count}</span>
            <div className="bar" style={{ height }} />
            <span className="bar-label">{score}</span>
          </div>
        );
      })}
    </div>
  );
}

function PillarChart({ responses }) {
  const rows = getPillarAverages(responses);

  return (
    <div className="pillar-bars">
      {rows.map((row) => (
        <div className="pillar-row" key={row.key}>
          <span>{row.label}</span>
          <div className="pillar-track">
            <div className="pillar-fill" style={{ width: `${row.percent}%` }} />
          </div>
          <strong>{row.average.toFixed(1)}</strong>
        </div>
      ))}
    </div>
  );
}

function TrendChart({ entries, valueKey, yMin, yMax, formatValue, showArea = true }) {
  if (!entries.length) {
    return <p className="muted">Sem dados suficientes para a série histórica.</p>;
  }

  const width = 760;
  const height = 260;
  const paddingX = 82;
  const paddingY = 28;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;
  const steps = Math.max(entries.length - 1, 1);
  const range = yMax - yMin;

  const points = entries.map((entry, index) => {
    const value = entry[valueKey];
    const x = paddingX + (usableWidth / steps) * index;
    const y = paddingY + usableHeight - ((value - yMin) / range) * usableHeight;
    return { ...entry, value, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(height - paddingY).toFixed(1)} L ${
    points[0].x.toFixed(1)
  } ${(height - paddingY).toFixed(1)} Z`;

  const step = range / 4;
  const yTicks = [0, 1, 2, 3, 4].map((i) => yMin + step * i);

  // Zero reference line for charts with a negative range
  const zeroY =
    yMin < 0 ? paddingY + usableHeight - ((0 - yMin) / range) * usableHeight : null;

  return (
    <svg className="trend-svg" role="img" viewBox={`0 0 ${width} ${height}`}>
      {yTicks.map((tick) => {
        const y = paddingY + usableHeight - ((tick - yMin) / range) * usableHeight;
        return (
          <g key={tick}>
            <line className="trend-grid-line" x1={paddingX} x2={width - paddingX} y1={y} y2={y} />
            <text className="trend-axis-label" textAnchor="end" x={paddingX - 14} y={y + 4}>
              {formatValue(tick)}
            </text>
          </g>
        );
      })}
      {zeroY !== null && (
        <line className="trend-zero-line" x1={paddingX} x2={width - paddingX} y1={zeroY} y2={zeroY} />
      )}
      {showArea && <path className="trend-area" d={areaPath} />}
      <path className="trend-line" d={linePath} />
      {points.map((point) => (
        <g key={point.month}>
          <circle className="trend-point" cx={point.x} cy={point.y} r="6" />
          <text className="trend-value-label" textAnchor="middle" x={point.x} y={point.y - 12}>
            {formatValue(point.value)}
          </text>
          <text className="trend-label" textAnchor="middle" x={point.x} y={height - 8}>
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ScoreDot({ value }) {
  return (
    <div className="score-dots">
      {[1, 2, 3, 4, 5].map((dot) => (
        <span className={`score-dot${dot <= value ? " score-dot-filled" : ""}`} key={dot} />
      ))}
    </div>
  );
}

function ResponseModal({ response, onClose }) {
  if (!response) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{response.clientName}</h2>
            <span className="modal-meta">
              {response.advisor} · NPS {response.npsScore} · CSAT {responseCsatPercent(response)}%
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-scores">
          {csatQuestions.map((q) => (
            <div className="modal-score-row" key={q.id}>
              <span className="modal-score-label">{q.shortLabel}</span>
              <ScoreDot value={response.csatAnswers?.[q.id]} />
              <span className="modal-score-num">{response.csatAnswers?.[q.id] ?? "—"}</span>
            </div>
          ))}
        </div>
        {(response.strengths || response.improvements || response.otherComments) && (
          <div className="modal-comments">
            {response.strengths && (
              <div className="modal-comment-block">
                <strong>Pontos fortes</strong>
                <p>{response.strengths}</p>
              </div>
            )}
            {response.improvements && (
              <div className="modal-comment-block">
                <strong>Melhorias</strong>
                <p>{response.improvements}</p>
              </div>
            )}
            {response.otherComments && (
              <div className="modal-comment-block">
                <strong>Outros comentários</strong>
                <p>{response.otherComments}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardClient({ initialResponses }) {
  const [advisor, setAdvisor] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return initialResponses.filter((response) => {
      const advisorMatch = advisor === "all" || response.advisor === advisor;
      const searchTarget = [
        response.clientName,
        response.strengths,
        response.improvements,
        response.otherComments,
      ]
        .join(" ")
        .toLowerCase();

      return advisorMatch && (!normalizedSearch || searchTarget.includes(normalizedSearch));
    });
  }, [advisor, initialResponses, search]);

  const metrics = useMemo(() => computeMetrics(filtered), [filtered]);
  const trendData = useMemo(() => getTrendData(filtered), [filtered]);
  const insights = useMemo(() => getInsights(filtered, metrics), [filtered, metrics]);

  return (
    <>
      <ResponseModal onClose={() => setSelected(null)} response={selected} />
      <section className="glass-card filters-card">
        <div className="filters-grid">
          <label>
            Advisor
            <select onChange={(event) => setAdvisor(event.target.value)} value={advisor}>
              <option value="all">Todos</option>
              {advisors.map((advisorName) => (
                <option key={advisorName} value={advisorName}>
                  {advisorName}
                </option>
              ))}
            </select>
          </label>

          <label className="field-span-2">
            Buscar cliente
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome do cliente"
              type="search"
              value={search}
            />
          </label>
        </div>
      </section>

      <section className="metrics-grid">
        <MetricCard
          caption={`${metrics.satisfiedAnswers}% de avaliações satisfeitas`}
          label="CSAT geral"
          value={`${metrics.csat}%`}
        />
        <MetricCard caption="Escala de 1 a 5" label="Média CSAT" value={metrics.averageCsat.toFixed(1)} />
        <MetricCard
          caption={`${metrics.promoters}% promotores | ${metrics.detractors}% detratores`}
          label="NPS"
          value={formatSigned(metrics.nps)}
        />
        <MetricCard caption="Respostas válidas no banco" label="Base ativa" value={String(metrics.total)} />
      </section>

      <section className="dashboard-grid">
        <article className="glass-card chart-card">
          <div className="panel-header">
            <h2>Distribuição de notas NPS</h2>
            <span>{metrics.total} respostas</span>
          </div>
          <div className="chart-surface">
            <ScoreChart responses={filtered} />
          </div>
        </article>

        <article className="glass-card chart-card">
          <div className="panel-header">
            <h2>Pilares da satisfação</h2>
            <span>Média CSAT por dimensão</span>
          </div>
          <div className="chart-surface">
            <PillarChart responses={filtered} />
          </div>
        </article>

        <article className="glass-card chart-card">
          <div className="panel-header">
            <h2>Evolução mensal — CSAT</h2>
            <span>Satisfação por período</span>
          </div>
          <div className="chart-surface">
            <TrendChart
              entries={trendData}
              formatValue={(v) => `${Math.round(v)}%`}
              valueKey="csat"
              yMax={100}
              yMin={0}
            />
          </div>
        </article>

        <article className="glass-card chart-card">
          <div className="panel-header">
            <h2>Evolução mensal — NPS</h2>
            <span>Lealdade por período</span>
          </div>
          <div className="chart-surface">
            <TrendChart
              entries={trendData}
              formatValue={(v) => (v > 0 ? `+${Math.round(v)}` : String(Math.round(v)))}
              showArea={false}
              valueKey="nps"
              yMax={100}
              yMin={-100}
            />
          </div>
        </article>

        <article className="glass-card chart-card wide">
          <div className="panel-header">
            <h2>Insights qualitativos</h2>
            <span>Leitura automática simples</span>
          </div>
          <div className="insights-panel">
            {insights.map((insight) => (
              <div className="insight-chip" key={insight.label}>
                <strong>{insight.label}</strong>
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="glass-card table-card">
        <div className="panel-header">
          <h2>Respostas recentes</h2>
          <span>{new Date().toLocaleString("pt-BR")}</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Advisor</th>
                <th>CSAT</th>
                <th>NPS</th>
                <th>Comentário</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.slice(0, 10).map((response) => {
                  const comment =
                    response.improvements || response.otherComments || response.strengths || "Sem comentário";

                  return (
                    <tr className="table-row-clickable" key={response.id} onClick={() => setSelected(response)}>
                      <td>{response.clientName}</td>
                      <td>{response.advisor}</td>
                      <td>{responseCsatPercent(response)}%</td>
                      <td>{response.npsScore}</td>
                      <td>{comment}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="muted" colSpan="5">
                    Nenhuma resposta encontrada para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
