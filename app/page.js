import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { PillarRadar } from "@/components/pillar-radar";
import { OfficeOverviewChart } from "@/components/office-overview";
import { computeMetrics, getPillarAverages, getTrendData } from "@/lib/analytics";
import { getHomeSummary } from "@/lib/data";

export const dynamic = "force-dynamic";

function formatSigned(value) {
  return value > 0 ? `+${value}` : String(value);
}

export default async function HomePage() {
  const responses = await getHomeSummary();
  const metrics = computeMetrics(responses);
  const pillars = getPillarAverages(responses);
  const trendData = getTrendData(responses);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Client Experience MZM Wealth</span>
          <h1>Client Experience MZM</h1>
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
          <div className="radar-wrap">
            <PillarRadar pillars={pillars} />
          </div>
        </div>
      </section>

      <section className="glass-card office-overview-section">
        <div className="panel-header">
          <div>
            <span className="section-label">Visão global do escritório</span>
            <h2 style={{ marginTop: 4 }}>CSAT e NPS consolidados</h2>
          </div>
          <Link className="button button-secondary button-sm" href="/dashboard">
            Ver relatório completo
          </Link>
        </div>
        <div className="chart-surface">
          <OfficeOverviewChart metrics={metrics} trendData={trendData} />
        </div>
      </section>

      <section className="advisor-layout">
        <article className="glass-card advisor-guide-card">
          <span className="section-label">Passo a passo</span>
          <h2>Como rodar um ciclo completo da pesquisa.</h2>
          <div className="guide-steps">
            <div className="guide-step">
              <strong>1. Importe a base de clientes</strong>
              <p>
                Na aba <strong>Importar</strong>, carregue a planilha Excel com os dados dos clientes — nome,
                e-mail, sigla e advisor responsável. O sistema cria todos os convites automaticamente.
              </p>
            </div>
            <div className="guide-step">
              <strong>2. Dispare os e-mails em lote</strong>
              <p>
                Na aba <strong>Enviar</strong>, use os filtros de consultor e status para segmentar a base.
                Clique em <strong>Enviar todos</strong> para disparar automaticamente os e-mails com a
                assinatura da Ariane e o link personalizado de cada cliente.
              </p>
            </div>
            <div className="guide-step">
              <strong>3. Acompanhe os status em tempo real</strong>
              <p>
                Na aba <strong>Status</strong>, monitore quem recebeu, abriu o link, está preenchendo ou já
                respondeu. Para reenviar apenas para os que ainda não responderam, use o filtro{" "}
                <strong>Não respondidos (todos)</strong> e dispare novamente em lote.
              </p>
            </div>
            <div className="guide-step">
              <strong>4. Exporte os resultados para o Salesforce</strong>
              <p>
                Ao fechar o ciclo, exporte pela aba <strong>Importar / Exportar</strong>. O arquivo gerado (.xlsx) já
                vem formatado com Sigla do Cliente, Advisor, NPS e CSAT — pronto para importar direto no
                Salesforce.
              </p>
            </div>
          </div>
        </article>

        <article className="glass-card advisor-guide-card">
          <span className="section-label">Boas práticas</span>
          <h2>Orientações para extrair o melhor da pesquisa.</h2>
          <ul className="insight-list">
            <li>
              Preencha a observação de relacionamento ao importar — ela personaliza o contexto de cada cliente
              e aumenta a taxa de resposta.
            </li>
            <li>
              Use os filtros de status para reenviar somente para quem ainda não respondeu, evitando
              incomodar quem já participou.
            </li>
            <li>
              Acompanhe a taxa de resposta na aba Status antes de exportar para o Salesforce — garante
              que o ciclo está suficientemente completo para análise.
            </li>
            <li>
              Ao receber um comentário relevante no dashboard, trate o retorno ao cliente como oportunidade
              de fortalecer confiança e parceria.
            </li>
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
            <p>
              Representa a confiança como fundamento da relação. Para o consultor, é o compromisso de agir com
              responsabilidade, lealdade e coerência em cada recomendação.
            </p>
          </article>
          <article className="elo-card">
            <strong>Transparência</strong>
            <p>
              Reforça a importância da clareza nas conversas, da franqueza nas orientações e da integridade nas
              decisões. Relações duradouras exigem compreensão mútua e comunicação sem ruído.
            </p>
          </article>
          <article className="elo-card">
            <strong>Fortuna</strong>
            <p>
              Aponta para a construção de prosperidade com visão de futuro. Mais do que resultado financeiro, este Elo
              conecta patrimônio, propósito e legado das famílias atendidas pela MZM Wealth.
            </p>
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
