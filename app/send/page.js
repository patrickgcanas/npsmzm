import { SendInviteForm } from "@/components/send-invite-form";

export const metadata = {
  title: "Enviar | MZM Client Experience",
};

export default function SendPage() {
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

      <SendInviteForm />
    </>
  );
}
