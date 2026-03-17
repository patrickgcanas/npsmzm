// Server component — pure SVG math, no "use client" needed
const CX = 110;
const CY = 108;
const MAX_R = 68;

// 3 pillar axes: NA=top, NS=bottom-right, NN=bottom-left
const ANGLES = {
  NA: -Math.PI / 2,
  NS: -Math.PI / 2 + (2 * Math.PI) / 3,
  NN: -Math.PI / 2 + (4 * Math.PI) / 3,
};

function pt(key, value, maxValue = 5) {
  const r = (value / maxValue) * MAX_R;
  return {
    x: CX + r * Math.cos(ANGLES[key]),
    y: CY + r * Math.sin(ANGLES[key]),
  };
}

function ringPath(value) {
  const keys = ["NA", "NS", "NN"];
  return keys.map((k, i) => {
    const { x, y } = pt(k, value);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") + " Z";
}

function dataPath(pillars) {
  const order = ["NA", "NS", "NN"];
  return order.map((key, i) => {
    const pillar = pillars.find((p) => p.key === key);
    const { x, y } = pt(key, pillar?.average ?? 0);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") + " Z";
}

export function PillarRadar({ pillars }) {
  const naAvg = pillars.find((p) => p.key === "NA")?.average ?? 0;
  const nsAvg = pillars.find((p) => p.key === "NS")?.average ?? 0;
  const nnAvg = pillars.find((p) => p.key === "NN")?.average ?? 0;

  const axisEndNA = pt("NA", 5);
  const axisEndNS = pt("NS", 5);
  const axisEndNN = pt("NN", 5);

  return (
    <svg className="radar-svg" viewBox="0 0 220 210" role="img" aria-label="Radar dos pilares de satisfação">
      {/* Grid rings */}
      {[1, 2, 3, 4, 5].map((v) => (
        <path className="radar-ring" d={ringPath(v)} key={v} />
      ))}

      {/* Axis lines */}
      <line className="radar-axis" x1={CX} y1={CY} x2={axisEndNA.x.toFixed(1)} y2={axisEndNA.y.toFixed(1)} />
      <line className="radar-axis" x1={CX} y1={CY} x2={axisEndNS.x.toFixed(1)} y2={axisEndNS.y.toFixed(1)} />
      <line className="radar-axis" x1={CX} y1={CY} x2={axisEndNN.x.toFixed(1)} y2={axisEndNN.y.toFixed(1)} />

      {/* Data polygon */}
      <path className="radar-fill" d={dataPath(pillars)} />
      <path className="radar-stroke" d={dataPath(pillars)} />

      {/* Data points */}
      {[
        { key: "NA", avg: naAvg },
        { key: "NS", avg: nsAvg },
        { key: "NN", avg: nnAvg },
      ].map(({ key, avg }) => {
        const { x, y } = pt(key, avg);
        return <circle className="radar-point" cx={x.toFixed(1)} cy={y.toFixed(1)} key={key} r="5" />;
      })}

      {/* Labels */}
      <text className="radar-label" textAnchor="middle" x={CX} y="14">
        Atendimento
      </text>
      <text className="radar-label-value" textAnchor="middle" x={CX} y="27">
        {naAvg.toFixed(1)}
      </text>
      <text className="radar-label" textAnchor="start" x={axisEndNS.x + 6} y={axisEndNS.y + 5}>
        Serviço
      </text>
      <text className="radar-label-value" textAnchor="start" x={axisEndNS.x + 6} y={axisEndNS.y + 17}>
        {nsAvg.toFixed(1)}
      </text>
      <text className="radar-label" textAnchor="end" x={axisEndNN.x - 6} y={axisEndNN.y + 5}>
        Negócio
      </text>
      <text className="radar-label-value" textAnchor="end" x={axisEndNN.x - 6} y={axisEndNN.y + 17}>
        {nnAvg.toFixed(1)}
      </text>
    </svg>
  );
}
