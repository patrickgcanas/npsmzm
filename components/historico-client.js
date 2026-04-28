"use client";

import { useMemo, useState } from "react";

function npsLabel(score) {
  if (score >= 9) return "Promotor";
  if (score >= 7) return "Neutro";
  return "Detrator";
}

function npsColor(score) {
  if (score >= 9) return "#1d6b52";
  if (score >= 7) return "#b78f52";
  return "#b94040";
}

function EvolutionChart({ points, yMin, yMax, color, formatY }) {
  if (!points.length) return null;
  const W = 560;
  const H = 120;
  const PAD = { top: 16, bottom: 32, left: 36, right: 16 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const range = Math.max(yMax - yMin, 1);

  const cx = (i) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const cy = (v) => PAD.top + innerH - ((v - yMin) / range) * innerH;

  const polyline = points.map((p, i) => `${cx(i).toFixed(1)},${cy(p.value).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", overflow: "visible" }}>
      {/* zero line for NPS */}
      {yMin < 0 && (
        <line
          x1={PAD.left} y1={cy(0).toFixed(1)}
          x2={W - PAD.right} y2={cy(0).toFixed(1)}
          stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="4 3"
        />
      )}

      {points.length > 1 && (
        <polyline fill="none" points={polyline} stroke={color} strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
      )}

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={cx(i)} cy={cy(p.value)} r="5" fill={color} />
          <text
            x={cx(i)} y={cy(p.value) - 10}
            textAnchor="middle" fontSize="11" fill={color} fontWeight="700"
          >
            {formatY(p.value)}
          </text>
          <text
            x={cx(i)} y={H - 4}
            textAnchor="middle" fontSize="10" fill="var(--text-soft)"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ClientCard({ client }) {
  const points = client.responses.map((r) => ({
    label: new Date(r.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
    nps: r.npsScore,
    csat: r.csat,
  }));

  const latest = client.responses.at(-1);

  return (
    <div className="glass-card historico-card">
      <div className="historico-card-header">
        <div>
          <h3 className="historico-client-name">{client.name}</h3>
          <span className="historico-client-meta">
            {client.code && <code className="bulk-code">{client.code}</code>}
            <span>{latest.advisor}</span>
            <span>{client.responses.length} resposta{client.responses.length !== 1 ? "s" : ""}</span>
          </span>
        </div>
        <div className="historico-badges">
          <span className="status-badge" style={{ background: "rgba(22,54,51,0.1)", color: "var(--brand-strong)" }}>
            NPS {latest.npsScore >= 0 ? "+" : ""}{latest.npsScore}
          </span>
          <span className="status-badge" style={{ background: "rgba(22,54,51,0.1)", color: "var(--brand-strong)" }}>
            CSAT {latest.csat}%
          </span>
        </div>
      </div>

      <div className="historico-charts">
        <div className="historico-chart-block">
          <span className="historico-chart-label">NPS relacional</span>
          <EvolutionChart
            points={points.map((p) => ({ value: p.nps, label: p.label }))}
            yMin={-100} yMax={100}
            color="#1d3d33"
            formatY={(v) => (v >= 0 ? `+${v}` : String(v))}
          />
        </div>
        <div className="historico-chart-divider" />
        <div className="historico-chart-block">
          <span className="historico-chart-label">CSAT (%)</span>
          <EvolutionChart
            points={points.map((p) => ({ value: p.csat, label: p.label }))}
            yMin={0} yMax={100}
            color="#b78f52"
            formatY={(v) => `${v}%`}
          />
        </div>
      </div>

      {client.responses.length > 1 && (
        <div className="historico-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Advisor</th>
                <th>NPS</th>
                <th>Perfil</th>
                <th>CSAT</th>
              </tr>
            </thead>
            <tbody>
              {[...client.responses].reverse().map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td>{r.advisor}</td>
                  <td style={{ fontWeight: 700, color: npsColor(r.npsScore) }}>
                    {r.npsScore >= 0 ? "+" : ""}{r.npsScore}
                  </td>
                  <td>
                    <span className="status-badge" style={{ background: `${npsColor(r.npsScore)}18`, color: npsColor(r.npsScore), fontSize: "0.78rem" }}>
                      {npsLabel(r.npsScore)}
                    </span>
                  </td>
                  <td>{r.csat}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function HistoricoClient({ responses, advisors }) {
  const [search, setSearch] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [advisorFilter, setAdvisorFilter] = useState("");

  const clients = useMemo(() => {
    const map = {};
    responses.forEach((r) => {
      const key = r.clientCode || r.clientName;
      if (!map[key]) map[key] = { name: r.clientName, code: r.clientCode, responses: [] };
      map[key].responses.push(r);
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [responses]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    const code = codeFilter.toLowerCase().trim();
    return clients.filter((c) => {
      const matchName = !term || c.name.toLowerCase().includes(term);
      const matchCode = !code || c.code.toLowerCase().includes(code);
      const matchAdvisor = !advisorFilter || c.responses.some((r) => r.advisor === advisorFilter);
      return matchName && matchCode && matchAdvisor;
    });
  }, [clients, search, codeFilter, advisorFilter]);

  const isFiltering = search || codeFilter || advisorFilter;

  return (
    <>
      <section className="glass-card filters-card">
        <div className="filters-grid">
          <label>
            Buscar cliente
            <input
              type="search"
              placeholder="Nome do cliente"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label>
            Sigla
            <input
              type="search"
              placeholder="Ex: MZM311JM"
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
            />
          </label>
          <label>
            Consultor
            <select value={advisorFilter} onChange={(e) => setAdvisorFilter(e.target.value)}>
              <option value="">Todos</option>
              {advisors.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
        </div>
      </section>

      {!responses.length ? (
        <section className="glass-card bulk-empty-state">
          <p className="bulk-subtitle">Nenhuma resposta registrada ainda. O histórico aparecerá aqui após o primeiro ciclo.</p>
        </section>
      ) : (
        <>
          <div className="panel-header" style={{ padding: "0 0 12px 0" }}>
            <span className="muted">
              {isFiltering ? `${filtered.length} de ${clients.length}` : clients.length} cliente{clients.length !== 1 ? "s" : ""} com histórico
            </span>
          </div>

          {filtered.length === 0 ? (
            <section className="glass-card bulk-empty-state">
              <p className="bulk-subtitle">Nenhum cliente encontrado para os filtros aplicados.</p>
            </section>
          ) : (
            <div className="historico-list">
              {filtered.map((c) => (
                <ClientCard key={c.code || c.name} client={c} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
