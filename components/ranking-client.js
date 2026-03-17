"use client";

import { useMemo } from "react";
import { advisors, pillarOrder } from "@/lib/survey";
import { computeMetrics, getPillarAverages } from "@/lib/analytics";

function getAdvisorRanking(responses) {
  const ranked = advisors.map((name) => {
    const advisorResponses = responses.filter((r) => r.advisor === name);
    if (!advisorResponses.length) {
      return { name, count: 0, csat: 0, nps: 0, averageCsat: 0, pillars: getPillarAverages([]), positiveComment: null, negativeComment: null };
    }

    const metrics = computeMetrics(advisorResponses);
    const pillarAverages = getPillarAverages(advisorResponses);
    const positiveComment = advisorResponses.map((r) => r.strengths).find(Boolean) || null;
    const negativeComment = advisorResponses.map((r) => r.improvements).find(Boolean) || null;

    return {
      name,
      count: advisorResponses.length,
      csat: metrics.csat,
      nps: metrics.nps,
      averageCsat: metrics.averageCsat,
      pillars: pillarAverages,
      positiveComment,
      negativeComment,
    };
  });

  // Sort: advisors with responses first (by CSAT), then no-response ones alphabetically
  const withData = ranked.filter((a) => a.count > 0).sort((a, b) => b.csat - a.csat);
  const withoutData = ranked.filter((a) => a.count === 0);
  return [...withData, ...withoutData];
}

function Medal({ rank, hasData }) {
  if (!hasData) return <span className="rank-position">—</span>;
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
  const rankedCount = ranking.filter((a) => a.count > 0).length;

  return (
    <div className="ranking-layout">
      {ranking.map((advisor, index) => {
        const hasData = advisor.count > 0;
        const rank = hasData ? index + 1 : null;

        return (
          <article className={`glass-card ranking-card${!hasData ? " ranking-card-empty" : ""}`} key={advisor.name}>
            <div className="ranking-card-header">
              <Medal hasData={hasData} rank={rank} />
              <div className="ranking-name-block">
                <strong>{advisor.name}</strong>
                <span className="ranking-count">
                  {hasData ? `${advisor.count} ${advisor.count === 1 ? "resposta" : "respostas"}` : "Sem respostas ainda"}
                </span>
              </div>
              {hasData && (
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
              )}
            </div>

            {hasData && (
              <>
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

                {(advisor.positiveComment || advisor.negativeComment) && (
                  <div className="ranking-comments">
                    {advisor.positiveComment && (
                      <div className="ranking-comment ranking-comment-positive">
                        <span className="ranking-comment-label">Ponto forte</span>
                        <p>&ldquo;{advisor.positiveComment}&rdquo;</p>
                      </div>
                    )}
                    {advisor.negativeComment && (
                      <div className="ranking-comment ranking-comment-negative">
                        <span className="ranking-comment-label">Ponto de melhoria</span>
                        <p>&ldquo;{advisor.negativeComment}&rdquo;</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
