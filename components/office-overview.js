// Pure presentational — no "use client" needed, works in server and client trees

function Sparkline({ values, yMin, yMax, color }) {
  if (values.length < 2) return <div className="kpi-sparkline" />;
  const W = 200;
  const H = 52;
  const range = Math.max(yMax - yMin, 1);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - yMin) / range) * H;
      return `${x.toFixed(1)},${Math.max(0, Math.min(H, y)).toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg className="kpi-sparkline" preserveAspectRatio="none" viewBox={`0 0 ${W} ${H}`}>
      <polyline
        fill="none"
        points={pts}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function formatSigned(v) {
  return v > 0 ? `+${v}` : String(v);
}

export function OfficeOverviewChart({ metrics, trendData }) {
  const csatValues = trendData.map((d) => d.csat);
  const npsValues = trendData.map((d) => d.nps);

  return (
    <div className="office-kpi-grid">
      <div className="office-kpi-item">
        <span className="office-kpi-label">CSAT do escritório</span>
        <Sparkline color="#173c38" values={csatValues} yMax={100} yMin={0} />
        <span className="office-kpi-value">{metrics.csat}%</span>
        <span className="office-kpi-sub">
          {metrics.satisfiedAnswers}% das avaliações com nota 4 ou 5
        </span>
      </div>
      <div className="office-kpi-divider" />
      <div className="office-kpi-item">
        <span className="office-kpi-label">NPS do escritório</span>
        <Sparkline color="#b78f52" values={npsValues} yMax={100} yMin={-100} />
        <span className="office-kpi-value">{formatSigned(metrics.nps)}</span>
        <span className="office-kpi-sub">
          {metrics.promoters}% promotores · {metrics.detractors}% detratores
        </span>
      </div>
    </div>
  );
}
