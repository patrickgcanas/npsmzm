import { SurveyForm } from "@/components/survey-form";

export const metadata = {
  title: "Modelo de Pesquisa | MZM Client Experience",
};

export default function SurveyModelPage() {
  return (
    <>
      <section className="section-header compact">
        <span className="eyebrow">Modelo de Pesquisa</span>
        <h1>Pesquisa de satisfação MZM Wealth</h1>
        <p>Sua percepção é essencial para evoluirmos a experiência consultiva oferecida aos nossos clientes.</p>
      </section>

      <section className="survey-layout">
        <article className="glass-card survey-card">
          <SurveyForm preview />
        </article>

        <aside className="glass-card insight-card">
          <span className="section-label">Leitura do formulário</span>
          <h2>O que esta pesquisa mede</h2>
          <ul className="insight-list">
            <li>NPS para sinalizar lealdade e potencial de recomendação.</li>
            <li>CSAT para medir satisfação objetiva em atributos da experiência.</li>
            <li>Comentários qualitativos para guiar ações de retenção e encantamento.</li>
          </ul>
        </aside>
      </section>
    </>
  );
}
