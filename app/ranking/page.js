import { getDashboardResponses } from "@/lib/data";
import { RankingClient } from "@/components/ranking-client";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const responses = await getDashboardResponses();

  return (
    <div className="page-inner">
      <div className="section-header compact">
        <span className="eyebrow">Performance</span>
        <h1>Ranking de Advisors</h1>
        <p>Desempenho comparativo por consultor baseado nas respostas dos clientes.</p>
      </div>
      <RankingClient initialResponses={responses} />
    </div>
  );
}
