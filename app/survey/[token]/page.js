import { notFound } from "next/navigation";
import { SurveyForm } from "@/components/survey-form";
import { getInviteByToken } from "@/lib/data";

export async function generateMetadata({ params }) {
  const invite = await getInviteByToken(params.token);

  if (!invite) {
    return {
      title: "Pesquisa não encontrada | MZM Wealth",
    };
  }

  return {
    title: `Pesquisa | ${invite.clientName} | MZM Wealth`,
  };
}

export default async function SurveyTokenPage({ params }) {
  const invite = await getInviteByToken(params.token);
  if (!invite) {
    notFound();
  }

  return (
    <>
      <section className="section-header compact">
        <span className="eyebrow">Pesquisa do cliente</span>
        <h1>Pesquisa de satisfação MZM Wealth</h1>
        <p>
          {invite.clientName}, sua percepção é essencial para evoluirmos a satisfação e a experiência consultiva da
          MZM Wealth.
        </p>
      </section>

      <section className="survey-layout survey-layout-public">
        <article className="glass-card survey-card">
          <SurveyForm
            advisor={invite.advisor}
            clientName={invite.clientName}
            hasResponse={Boolean(invite.response)}
            token={invite.token}
          />
        </article>
      </section>
    </>
  );
}
