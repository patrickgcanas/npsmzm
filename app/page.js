import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { computeMetrics } from "@/lib/analytics";
import { getHomeSummary } from "@/lib/data";

export const dynamic = "force-dynamic";

function formatSigned(value) {
  return value > 0 ? `+${value}` : String(value);
}

export default async function HomePage() {
  const responses = await getHomeSummary();
  const metrics = computeMetrics(responses);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Client Experience MZM Wealth</span>
          <h1>Client Experience MZM</h1>
          <p className="hero-text">
            A nova base do projeto já nasce com servidor, banco de dados e links dinâmicos para que a MZM Wealth
            conduza a pesquisa de satisfação de forma real, escalável e com leitura executiva.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/send">
              Criar convites
            </Link>
            <Link className="button button-secondary" href="/dashboard">
              Ver relatório
            </Link>
          </div>
        </div>

        <div className="hero-panel glass-card">
          <div className="panel-header">
            <span>Radar da Experiência</span>
            <span className="live-pill">Dados persistidos</span>
          </div>
          <div className="hero-metrics">
            <MetricCard
              caption={`${metrics.satisfiedAnswers}% de respostas 4 ou 5`}
              label="CSAT geral"
              value={`${metrics.csat}%`}
            />
            <MetricCard
              caption={`${metrics.promoters}% promotores`}
              label="NPS relacional"
              value={formatSigned(metrics.nps)}
            />
            <MetricCard caption="Base centralizada no banco" label="Respostas" value={String(metrics.total)} />
          </div>
          <div className="hero-note">
            Esta versão substitui o armazenamento local por persistência real em banco, pronta para evoluir com login,
            automação de disparo e integração futura com CRM.
          </div>
        </div>
      </section>

      <section className="advisor-layout">
        <article className="glass-card advisor-guide-card">
          <span className="section-label">Passo a passo</span>
          <h2>Como enviar a pesquisa de satisfação aos clientes.</h2>
          <div className="guide-steps">
            <div className="guide-step">
              <strong>1. Acesse a central de envio</strong>
              <p>Cadastre o cliente, selecione o advisor responsável e registre o contexto que ajuda a personalizar o convite.</p>
            </div>
            <div className="guide-step">
              <strong>2. Gere o link dinâmico</strong>
              <p>O sistema cria um token exclusivo para cada cliente, com rastreabilidade da resposta e um link pronto para compartilhamento.</p>
            </div>
            <div className="guide-step">
              <strong>3. Compartilhe no melhor momento</strong>
              <p>Use o convite em marcos relevantes da relação, como revisões estratégicas, entregas importantes ou após uma reunião-chave.</p>
            </div>
            <div className="guide-step">
              <strong>4. Feche o ciclo com ação</strong>
              <p>O dashboard consolida CSAT, NPS e comentários para orientar retorno ao cliente, priorização comercial e melhoria contínua.</p>
            </div>
          </div>
        </article>

        <article className="glass-card advisor-guide-card">
          <span className="section-label">Boas práticas</span>
          <h2>Orientações rápidas para os consultores.</h2>
          <ul className="insight-list">
            <li>Explique que a pesquisa é breve, personalizada e orientada a melhorar a experiência do cliente.</li>
            <li>Evite disparos em massa. O vínculo consultivo da MZM pede contexto, momento e relevância.</li>
            <li>Use a observação de relacionamento para tornar a mensagem mais aderente à jornada daquela família.</li>
            <li>Ao receber um comentário importante, trate o retorno como oportunidade de fortalecer confiança e parceria.</li>
          </ul>
        </article>
      </section>

      <section className="elos-section glass-card">
        <span className="section-label">Elos MZM</span>
        <h2>Os princípios que conectam propósito, conduta e relação com o cliente.</h2>
        <p className="elos-intro">
          Os Elos da MZM reforçam como a empresa deseja ser percebida na prática: com lealdade, clareza e visão de
          longo prazo. Eles funcionam como referência para o discurso consultivo, para a qualidade do serviço e para a
          forma como cada cliente é acompanhado ao longo da jornada.
        </p>

        <div className="elos-grid">
          <article className="elo-card">
            <strong>Fidúcia</strong>
            <p>Representa a confiança como fundamento da relação. Para o consultor, é o compromisso de agir com responsabilidade, lealdade e coerência em cada recomendação.</p>
          </article>
          <article className="elo-card">
            <strong>Transparência</strong>
            <p>Reforça a importância da clareza nas conversas, da franqueza nas orientações e da integridade nas decisões. Relações duradouras exigem compreensão mútua e comunicação sem ruído.</p>
          </article>
          <article className="elo-card">
            <strong>Fortuna</strong>
            <p>Aponta para a construção de prosperidade com visão de futuro. Mais do que resultado financeiro, este Elo conecta patrimônio, propósito e legado das famílias atendidas pela MZM Wealth.</p>
          </article>
        </div>

        <article className="manifesto-card">
          <span className="section-label">Manifesto MZM</span>
          <p className="manifesto-lead">
            Na MZM Wealth, acreditamos que a confiança é o alicerce sobre o qual construímos relacionamentos sólidos.
            Somos impulsionados por um compromisso inabalável com a transparência e a integridade, proporcionando uma
            base confiável para o alcance de objetivos e sonhos.
          </p>
          <div className="manifesto-columns">
            <p className="manifesto-body">
              Nosso foco central no cliente é a essência do que fazemos. Estratégias e decisões são moldadas através
              de um entendimento profundo das necessidades individuais de cada pessoa ou família que auxiliamos.
            </p>
            <p className="manifesto-body">
              Buscamos entregar a todos que estão a nossa volta a tranquilidade de terem um guia experiente e
              confiável, sempre em sintonia com vivências, histórias e objetivos.
            </p>
            <p className="manifesto-body">
              Acreditamos que o sucesso é uma jornada compartilhada. Estamos dedicados a superar expectativas,
              construir confiança e sustentar um futuro financeiro sólido e próspero.
            </p>
            <p className="manifesto-body">
              Hoje temos um propósito muito claro: caminhar lado a lado na construção do legado daqueles que nos
              cercam.
            </p>
          </div>
        </article>
      </section>
    </>
  );
}
