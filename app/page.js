import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { PillarRadar } from "@/components/pillar-radar";
import { OfficeOverviewChart } from "@/components/office-overview";
import { computeMetrics, getPillarAverages, getTrendData } from "@/lib/analytics";
import { getHomeSummary } from "@/lib/data";

function getResendReminders(responses) {
  const today = new Date();
  return responses
    .map((r) => {
      const isPromoter = r.npsScore >= 9;
      const months = isPromoter ? 12 : 6;
      const respondedAt = new Date(r.createdAt);
      const resendAt = new Date(respondedAt);
      resendAt.setMonth(resendAt.getMonth() + months);
      const daysUntil = Math.ceil((resendAt - today) / (1000 * 60 * 60 * 24));
      return { ...r, resendAt, daysUntil, isPromoter };
    })
    .filter((r) => r.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

export const dynamic = "force-dynamic";

function formatSigned(value) {
  return value > 0 ? `+${value}` : String(value);
}

export default async function HomePage() {
  const responses = await getHomeSummary();
  const metrics = computeMetrics(responses);
  const pillars = getPillarAverages(responses);
  const trendData = getTrendData(responses);
  const reminders = getResendReminders(responses);

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

      {reminders.length > 0 && (
        <section className="glass-card reminder-card">
          <div className="panel-header">
            <div>
              <span className="section-label">Lembrete de reenvio</span>
              <h2 style={{ marginTop: 4 }}>Clientes com pesquisa a reenviar</h2>
            </div>
            <Link className="button button-primary button-sm" href="/send">
              Ir para Enviar
            </Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Advisor</th>
                  <th>NPS anterior</th>
                  <th>Perfil</th>
                  <th>Respondeu em</th>
                  <th>Reenviar em</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((r) => (
                  <tr key={r.id}>
                    <td>{r.clientName}</td>
                    <td>{r.advisor}</td>
                    <td>{r.npsScore}</td>
                    <td>
                      <span className={`reminder-badge ${r.isPromoter ? "reminder-promoter" : r.npsScore >= 7 ? "reminder-neutral" : "reminder-detractor"}`}>
                        {r.isPromoter ? "Promotor" : r.npsScore >= 7 ? "Neutro" : "Detrator"}
                      </span>
                    </td>
                    <td>{new Date(r.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td>{r.resendAt.toLocaleDateString("pt-BR")}</td>
                    <td>
                      <span className={`reminder-badge ${r.daysUntil <= 0 ? "reminder-overdue" : "reminder-soon"}`}>
                        {r.daysUntil <= 0 ? "Vencido" : `Em ${r.daysUntil} dia${r.daysUntil !== 1 ? "s" : ""}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

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

    </>
  );
}
