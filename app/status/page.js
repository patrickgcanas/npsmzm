import { StatusClient } from "@/components/status-client";
import { getAllInvites, getAppUrl } from "@/lib/data";

export const metadata = {
  title: "Status | MZM Client Experience",
};

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const invites = await getAllInvites();
  const appUrl = getAppUrl();

  return (
    <>
      <section className="section-header">
        <span className="eyebrow">Acompanhamento</span>
        <h1>Status da pesquisa</h1>
        <p>Visão geral de todos os convites enviados e situação de preenchimento por cliente.</p>
      </section>

      <StatusClient appUrl={appUrl} initialInvites={invites} />
    </>
  );
}
