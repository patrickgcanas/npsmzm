import { DashboardClient } from "@/components/dashboard-client";
import { getDashboardResponses } from "@/lib/data";

export const metadata = {
  title: "Dashboard | MZM Client Experience",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const responses = await getDashboardResponses();

  return (
    <>
      <section className="section-header">
        <span className="eyebrow">Análise executiva</span>
        <h1>Dashboard da pesquisa de satisfação</h1>
        <p>
          KPIs de relacionamento, leitura CSAT dos atributos da experiência, NPS relacional e visão consolidada dos
          comentários dos clientes.
        </p>
      </section>

      <DashboardClient initialResponses={responses} />
    </>
  );
}
