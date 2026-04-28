import { HistoricoClient } from "@/components/historico-client";
import { getAllResponseHistory } from "@/lib/data";
import { advisors } from "@/lib/survey";

export const metadata = { title: "Histórico | MZM Client Experience" };
export const dynamic = "force-dynamic";

export default async function HistoricoPage() {
  const responses = await getAllResponseHistory();

  return (
    <>
      <section className="section-header">
        <span className="eyebrow">Evolução por cliente</span>
        <h1>Histórico de pesquisas</h1>
        <p>Acompanhe a evolução de NPS e CSAT de cada cliente ao longo dos ciclos.</p>
      </section>

      <HistoricoClient responses={responses} advisors={advisors} />
    </>
  );
}
