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
        <h1>Envie pesquisas de satisfação para sua base de clientes.</h1>
        <p>
          Importe sua base, filtre por consultor ou sigla e envie em lote. Para um cliente específico, use o formulário abaixo.
        </p>
      </section>

      <BulkEmailPanel appUrl={appUrl} pendingInvites={pending} />

      <SendInviteForm />
    </>
  );
}
