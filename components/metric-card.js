export function MetricCard({ label, value, caption }) {
  return (
    <article className="metric-card">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
      <span className="metric-caption">{caption}</span>
    </article>
  );
}
