"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { advisors } from "@/lib/survey";

const STATUS_LABEL = {
  pending: "Pendente",
  sending: "Enviando…",
  sent:    "Enviado",
  failed:  "Falhou",
};

const STATUS_CLASS = {
  pending: "bulk-status bulk-status--pending",
  sending: "bulk-status bulk-status--sending",
  sent:    "bulk-status bulk-status--sent",
  failed:  "bulk-status bulk-status--failed",
};

function StatusBadge({ status }) {
  return (
    <span className={STATUS_CLASS[status] || STATUS_CLASS.pending}>
      {STATUS_LABEL[status] || "Pendente"}
    </span>
  );
}

export function BulkEmailPanel({ pendingInvites }) {
  const router = useRouter();

  const [statusMap, setStatusMap] = useState(() => {
    const map = {};
    pendingInvites.forEach((inv) => {
      map[inv.id] = inv.sendStatus || "pending";
    });
    return map;
  });

  const [sendingAll, setSendingAll]           = useState(false);
  const [clearing,   setClearing]             = useState(false);
  const [advisorFilter, setAdvisorFilter]     = useState("");
  const [surveyStatusFilter, setSurveyStatus] = useState("");
  const [search, setSearch]                   = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return pendingInvites.filter((invite) => {
      const matchesAdvisor = !advisorFilter || invite.advisor === advisorFilter;
      const matchesSearch =
        !q ||
        invite.clientName.toLowerCase().includes(q) ||
        (invite.clientCode || "").toLowerCase().includes(q);
      const matchesSurveyStatus =
        !surveyStatusFilter ||
        (surveyStatusFilter === "pending"  && !invite.sentAt) ||
        (surveyStatusFilter === "sent"     && invite.sentAt && !invite.viewedAt) ||
        (surveyStatusFilter === "viewed"   && invite.viewedAt && !invite.startedAt) ||
        (surveyStatusFilter === "started"  && invite.startedAt);
      return matchesAdvisor && matchesSearch && matchesSurveyStatus;
    });
  }, [pendingInvites, advisorFilter, surveyStatusFilter, search]);

  function setStatus(id, status) {
    setStatusMap((prev) => ({ ...prev, [id]: status }));
  }

  async function handleSendOne(inviteId) {
    setStatus(inviteId, "sending");
    try {
      const res  = await fetch("/api/invites/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inviteId }),
      });
      const data = await res.json();
      setStatus(inviteId, data.success ? "sent" : "failed");
    } catch {
      setStatus(inviteId, "failed");
    }
  }

  async function handleSendAll() {
    const eligibleIds = filtered
      .filter((inv) => {
        const s = statusMap[inv.id];
        return (s === "pending" || s === "failed") && inv.clientEmail;
      })
      .map((inv) => inv.id);

    if (!eligibleIds.length) return;

    if (!confirm(`Enviar e-mail para ${eligibleIds.length} cliente(s)? Esta ação não pode ser desfeita.`)) return;

    setSendingAll(true);
    eligibleIds.forEach((id) => setStatus(id, "sending"));

    try {
      const res  = await fetch("/api/invites/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: eligibleIds }),
      });
      const { results } = await res.json();
      results?.forEach((r) => {
        if (r.id) setStatus(r.id, r.success ? "sent" : "failed");
      });
    } catch {
      eligibleIds.forEach((id) => setStatus(id, "failed"));
    } finally {
      setSendingAll(false);
    }
  }

  async function handleClear() {
    if (!confirm(`Remover os ${pendingInvites.length} convite(s) pendente(s)? Esta ação não pode ser desfeita.`)) return;
    setClearing(true);
    try {
      await fetch("/api/invites/clear", { method: "DELETE" });
      router.refresh();
    } finally {
      setClearing(false);
    }
  }

  const total        = pendingInvites.length;
  const sentCount    = Object.values(statusMap).filter((s) => s === "sent").length;
  const isFiltering  = advisorFilter || search.trim();
  const eligibleCount = filtered.filter((inv) => {
    const s = statusMap[inv.id];
    return (s === "pending" || s === "failed") && inv.clientEmail;
  }).length;

  if (total === 0) {
    return (
      <section className="glass-card bulk-panel-card bulk-empty-state">
        <h2>Envio em lote</h2>
        <p className="bulk-subtitle">Nenhum convite pendente. Importe sua base de clientes para começar.</p>
        <a className="button button-secondary" href="/import">Ir para Importar</a>
      </section>
    );
  }

  return (
    <section className="glass-card bulk-panel-card">
      <div className="panel-header">
        <div>
          <h2>Envio em lote</h2>
          <p className="bulk-subtitle">
            Envie individualmente por linha ou use <strong>Enviar todos</strong> para disparar em lote.
            {sentCount > 0 && (
              <span className="bulk-progress"> {sentCount} de {total} enviado{sentCount !== 1 ? "s" : ""}.</span>
            )}
          </p>
        </div>
        <div className="panel-header-actions">
          <span className="status-badge">
            {isFiltering ? `${filtered.length} de ${total}` : total} pendente{total !== 1 ? "s" : ""}
          </span>
          <button
            className="button button-primary button-sm"
            disabled={sendingAll || eligibleCount === 0}
            onClick={handleSendAll}
          >
            {sendingAll ? "Enviando…" : `Enviar todos (${eligibleCount})`}
          </button>
          <button
            className="button button-ghost button-sm"
            disabled={clearing}
            onClick={handleClear}
          >
            {clearing ? "Limpando..." : "Limpar registros"}
          </button>
        </div>
      </div>

      <div className="bulk-filters">
        <select
          className="bulk-filter-select"
          value={advisorFilter}
          onChange={(e) => setAdvisorFilter(e.target.value)}
        >
          <option value="">Todos os consultores</option>
          {advisors.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          className="bulk-filter-select"
          value={surveyStatusFilter}
          onChange={(e) => setSurveyStatus(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="pending">Aguardando envio</option>
          <option value="sent">Enviado, não abriu</option>
          <option value="viewed">Abriu o link</option>
          <option value="started">Em preenchimento</option>
        </select>
        <input
          className="bulk-filter-search"
          placeholder="Buscar por nome ou sigla..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <p className="bulk-empty">Nenhum convite encontrado para os filtros aplicados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Sigla</th>
                <th>E-mail</th>
                <th>Consultor</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invite) => {
                const status    = statusMap[invite.id] || "pending";
                const isSending = status === "sending";
                const isSent    = status === "sent";
                const noEmail   = !invite.clientEmail;

                return (
                  <tr key={invite.id} className={isSent ? "bulk-row-done" : ""}>
                    <td>{invite.clientName}</td>
                    <td><code className="bulk-code">{invite.clientCode || "—"}</code></td>
                    <td>{invite.clientEmail || <em className="bulk-no-email">sem e-mail</em>}</td>
                    <td>{invite.advisor}</td>
                    <td><StatusBadge status={status} /></td>
                    <td>
                      <button
                        className="button button-secondary button-sm"
                        disabled={isSending || noEmail}
                        onClick={() => handleSendOne(invite.id)}
                        title={noEmail ? "Convite sem e-mail cadastrado" : undefined}
                      >
                        {isSending ? "Enviando…" : isSent ? "Reenviar" : "Enviar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
