import { SendInviteForm } from "@/components/send-invite-form";
import { BulkEmailPanel } from "@/components/bulk-email-panel";
import { getAllInvites, getAppUrl } from "@/lib/data";

export const metadata = {
  title: "Enviar | MZM Client Experience",
};

export const dynamic = "force-dynamic";

export default async function SendPage() {
  const invites = await getAllInvites();
  const appUrl = getAppUrl();
  const pending = invites.filter((i) => !i.responded && i.clientEmail);

  return (
    <>
      <section className="section-header">
        <span className="eyebrow">Central de envio</span>
        <h1>Monte o convite da pesquisa em poucos passos.</h1>
        <p>
          Gere um link individual no servidor, personalize a mensagem e acompanhe depois a resposta de cada cliente no
          dashboard.
        </p>
      </section>

      {pending.length > 0 && <BulkEmailPanel appUrl={appUrl} pendingInvites={pending} />}

      <SendInviteForm />
    </>
  );
}
