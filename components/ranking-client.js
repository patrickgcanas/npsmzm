"use client";

import { useMemo } from "react";
import { advisors, csatQuestions, pillarOrder } from "@/lib/survey";
import { computeMetrics, getCsatValues, getPillarAverages, responseCsatPercent } from "@/lib/analytics";

function getAdvisorRanking(responses) {
  return advisors
    .map((name) => {
      const advisorResponses = responses.filter((r) => r.advisor === name);
      if (!advisorResponses.length) return null;

      const metrics = computeMetrics(advisorResponses);
      const pillarAverages = getPillarAverages(advisorResponses);
      const latestComment = advisorResponses
        .map((r) => r.improvements || r.otherComments || r.strengths)
        .find(Boolean);

      return {
        name,
        count: advisorResponses.length,
        csat: metrics.csat,
        nps: metrics.nps,
        averageCsat: metrics.averageCsat,
        pillars: pillarAverages,
        latestComment: latestComment || null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.csat - a.csat);
}

function Medal({ rank }) {
  if (rank === 1) return <span className="rank-medal rank-gold">1°</span>;
  if (rank === 2) return <span className="rank-medal rank-silver">2°</span>;
  if (rank === 3) return <span className="rank-medal rank-bronze">3°</span>;
  return <span className="rank-position">{rank}°</span>;
}

function NpsChip({ value }) {
  const positive = value >= 0;
  return (
    <span className={`nps-chip${positive ? " nps-positive" : " nps-negative"}`}>
      {positive ? `+${value}` : value}
    </span>
  );
}

export function RankingClient({ initialResponses }) {
  const ranking = useMemo(() => getAdvisorRanking(initialResponses), [initialResponses]);

  if (!ranking.length) {
    return (
      <div className="empty-state">
        <p>Nenhuma resposta registrada ainda. O ranking aparecerá assim que as pesquisas forem respondidas.</p>
      </div>
    );
  }

  return (
    <div className="ranking-layout">
      {ranking.map((advisor, index) => (
        <article className="glass-card ranking-card" key={advisor.name}>
          <div className="ranking-card-header">
            <Medal rank={index + 1} />
            <div className="ranking-name-block">
              <strong>{advisor.name}</strong>
              <span className="ranking-count">{advisor.count} {advisor.count === 1 ? "resposta" : "respostas"}</span>
            </div>
            <div className="ranking-scores">
              <div className="ranking-score-item">
                <span className="ranking-score-label">CSAT</span>
                <span className="ranking-score-value">{advisor.csat}%</span>
              </div>
              <div className="ranking-score-item">
                <span className="ranking-score-label">Média</span>
                <span className="ranking-score-value">{advisor.averageCsat.toFixed(1)}</span>
              </div>
              <div className="ranking-score-item">
                <span className="ranking-score-label">NPS</span>
                <NpsChip value={advisor.nps} />
              </div>
            </div>
          </div>

          <div className="ranking-pillars">
            {advisor.pillars.map((pillar) => (
              <div className="ranking-pillar-row" key={pillar.key}>
                <span className="ranking-pillar-label">{pillar.label}</span>
                <div className="pillar-track">
                  <div className="pillar-fill" style={{ width: `${pillar.percent}%` }} />
                </div>
                <strong>{pillar.average.toFixed(1)}</strong>
              </div>
            ))}
          </div>

          {advisor.latestComment && (
            <div className="ranking-comment">
              <span className="ranking-comment-label">Último comentário</span>
              <p>&ldquo;{advisor.latestComment}&rdquo;</p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
