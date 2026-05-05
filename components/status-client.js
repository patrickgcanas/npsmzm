"use client";

import { useMemo, useState } from "react";
import { advisors } from "@/lib/survey";
import { MetricCard } from "@/components/metric-card";


export function StatusClient({ initialInvites }) {
  const [search, setSearch] = useState("");
  const [advisorFilter, setAdvisorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contractFrom, setContractFrom] = useState("");
  const [contractTo, setContractTo] = useState("");
  const [sentFrom, setSentFrom] = useState("");
  const [sentTo, setSentTo] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const contractStart = contractFrom ? new Date(contractFrom).getTime() : null;
    const contractEnd   = contractTo   ? new Date(contractTo + "T23:59:59").getTime() : null;
    const sentStart     = sentFrom     ? new Date(sentFrom).getTime() : null;
    const sentEnd       = sentTo       ? new Date(sentTo + "T23:59:59").getTime() : null;

    return initialInvites.filter((invite) => {
      const matchSearch =
        !term ||
        invite.clientName.toLowerCase().includes(term) ||
        (invite.clientCode || "").toLowerCase().includes(term);
      const matchAdvisor = advisorFilter === "all" || invite.advisor === advisorFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "responded" && invite.responded) ||
        (statusFilter === "started" && !invite.responded && invite.startedAt) ||
        (statusFilter === "viewed" && !invite.responded && !invite.startedAt && invite.viewedAt) ||
        (statusFilter === "sent" && !invite.responded && !invite.viewedAt && invite.sentAt && invite.sendStatus !== "failed") ||
        (statusFilter === "failed" && invite.sendStatus === "failed") ||
        (statusFilter === "pending" && !invite.sentAt && invite.sendStatus !== "failed");

      const contractTs = invite.contractDate ? new Date(invite.contractDate).getTime() : null;
      const matchContractFrom = !contractStart || (contractTs && contractTs >= contractStart);
      const matchContractTo   = !contractEnd   || (contractTs && contractTs <= contractEnd);

      const sentTs = invite.sentAt ? new Date(invite.sentAt).getTime() : null;
      const matchSentFrom = !sentStart || (sentTs && sentTs >= sentStart);
      const matchSentTo   = !sentEnd   || (sentTs && sentTs <= sentEnd);

      return matchSearch && matchAdvisor && matchStatus &&
        matchContractFrom && matchContractTo && matchSentFrom && matchSentTo;
    });
  }, [initialInvites, search, advisorFilter, statusFilter, contractFrom, contractTo, sentFrom, sentTo]);

  const total = initialInvites.length;
  const responded = initialInvites.filter((i) => i.responded).length;
  const started = initialInvites.filter((i) => !i.responded && i.startedAt).length;
  const viewed = initialInvites.filter((i) => !i.responded && !i.startedAt && i.viewedAt).length;
  const sent = initialInvites.filter((i) => !i.responded && !i.viewedAt && i.sentAt && i.sendStatus !== "failed").length;
  const pending = initialInvites.filter((i) => !i.sentAt && i.sendStatus !== "failed").length;
  const failed = initialInvites.filter((i) => i.sendStatus === "failed").length;
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

  return (
    <>
      <section className="metrics-grid status-metrics">
        <MetricCard label="Total criados" value={String(total)} caption="convites na base atual" />
        <MetricCard label="Taxa de resposta" value={`${responseRate}%`} caption={`${responded} de ${total} respondidos`} />
        <MetricCard label="Em preenchimento" value={String(started)} caption="abriu mas não concluiu" />
        <MetricCard label="Abriu o link" value={String(viewed)} caption="visualizou, não respondeu" />
        <MetricCard label="Enviado" value={String(sent)} caption="e-mail disparado, sem abertura" />
        <MetricCard label="Aguardando envio" value={String(pending)} caption="ainda não disparado" />
        {failed > 0 && <MetricCard label="Falha no envio" value={String(failed)} caption="erro ao disparar e-mail" />}
      </section>

      <section className="glass-card filters-card">
        <div className="filters-grid">
          <label>
            Buscar cliente
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome ou sigla do cliente"
              type="search"
              value={search}
            />
          </label>
          <label>
            Advisor
            <select onChange={(e) => setAdvisorFilter(e.target.value)} value={advisorFilter}>
              <option value="all">Todos</option>
              {advisors.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
              <option value="all">Todos</option>
              <option value="responded">Respondida</option>
              <option value="started">Em preenchimento</option>
              <option value="viewed">Abriu o link</option>
              <option value="sent">Enviado</option>
              <option value="pending">Aguardando envio</option>
              <option value="failed">Falha no envio</option>
            </select>
          </label>
          <label>
            Contrato — de
            <input type="date" value={contractFrom} onChange={(e) => setContractFrom(e.target.value)} />
          </label>
          <label>
            Contrato — até
            <input type="date" value={contractTo} onChange={(e) => setContractTo(e.target.value)} />
          </label>
          <label>
            Primeiro envio — de
            <input type="date" value={sentFrom} onChange={(e) => setSentFrom(e.target.value)} />
          </label>
          <label>
            Primeiro envio — até
            <input type="date" value={sentTo} onChange={(e) => setSentTo(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="glass-card table-card">
        <div className="panel-header">
          <h2>Convites enviados</h2>
            <span>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Sigla</th>
                <th>Advisor</th>
                <th>Data Contrato</th>
                <th>Criado em</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((invite) => (
                  <tr key={invite.id}>
                    <td>{invite.clientName}</td>
                    <td>{invite.clientCode || "—"}</td>
                    <td>{invite.advisor}</td>
                    <td>{invite.contractDate ? new Date(invite.contractDate).toLocaleDateString("pt-BR") : "—"}</td>
                    <td>{new Date(invite.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td>
                      {invite.responded ? (
                        <span className="status-badge status-responded">Respondida</span>
                      ) : invite.startedAt ? (
                        <span className="status-badge status-started">Em preenchimento</span>
                      ) : invite.viewedAt ? (
                        <span className="status-badge status-viewed">Abriu o link</span>
                      ) : invite.sendStatus === "failed" ? (
                        <span className="status-badge status-failed">Falha no envio</span>
                      ) : invite.sentAt ? (
                        <span className="status-badge status-sent">Enviado</span>
                      ) : (
                        <span className="status-badge status-pending">Aguardando envio</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="muted" colSpan="6">
                    Nenhum convite encontrado para a busca realizada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
