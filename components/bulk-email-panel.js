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
  const [dateFrom, setDateFrom]               = useState("");
  const [dateTo, setDateTo]                   = useState("");
  const [selected, setSelected]               = useState(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const from = dateFrom ? new Date(dateFrom) : null;
    const to   = dateTo   ? new Date(dateTo + "T23:59:59") : null;

    return pendingInvites.filter((invite) => {
      const matchesAdvisor = !advisorFilter || invite.advisor === advisorFilter;
      const matchesSearch =
        !q ||
        invite.clientName.toLowerCase().includes(q) ||
        (invite.clientCode || "").toLowerCase().includes(q);
      const matchesSurveyStatus =
        !surveyStatusFilter ||
        surveyStatusFilter === "not_responded" ||
        (surveyStatusFilter === "pending"  && !invite.sentAt) ||
        (surveyStatusFilter === "sent"     && invite.sentAt && !invite.viewedAt) ||
        (surveyStatusFilter === "viewed"   && invite.viewedAt && !invite.startedAt) ||
        (surveyStatusFilter === "started"  && invite.startedAt);
      const inviteDate = invite.contractDate ? new Date(invite.contractDate) : null;
      const matchesDate =
        (!from || (inviteDate && inviteDate >= from)) &&
        (!to   || (inviteDate && inviteDate <= to));
      return matchesAdvisor && matchesSearch && matchesSurveyStatus && matchesDate;
    });
  }, [pendingInvites, advisorFilter, surveyStatusFilter, search, dateFrom, dateTo]);

  const eligibleFiltered = filtered.filter((inv) => {
    const s = statusMap[inv.id];
    return (s === "pending" || s === "failed") && inv.clientEmail;
  });

  const selectedEligible = eligibleFiltered.filter((inv) => selected.has(inv.id));

  const allVisibleSelected =
    eligibleFiltered.length > 0 &&
    eligibleFiltered.every((inv) => selected.has(inv.id));

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        eligibleFiltered.forEach((inv) => next.delete(inv.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        eligibleFiltered.forEach((inv) => next.add(inv.id));
        return next;
      });
    }
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

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

  async function handleSendBatch(ids, label) {
    if (!ids.length) return;
    if (!confirm(`Enviar e-mail para ${ids.length} cliente(s) ${label}? Esta ação não pode ser desfeita.`)) return;

    setSendingAll(true);
    ids.forEach((id) => setStatus(id, "sending"));

    try {
      const res  = await fetch("/api/invites/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const { results } = await res.json();
      results?.forEach((r) => {
        if (r.id) setStatus(r.id, r.success ? "sent" : "failed");
      });
    } catch {
      ids.forEach((id) => setStatus(id, "failed"));
    } finally {
      setSendingAll(false);
      setSelected(new Set());
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

  const total       = pendingInvites.length;
  const sentCount   = Object.values(statusMap).filter((s) => s === "sent").length;
  const isFiltering = advisorFilter || search.trim() || dateFrom || dateTo;

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
            Selecione clientes e use <strong>Enviar selecionados</strong>, ou envie todos os elegíveis de uma vez.
            {sentCount > 0 && (
              <span className="bulk-progress"> {sentCount} de {total} enviado{sentCount !== 1 ? "s" : ""}.</span>
            )}
          </p>
        </div>
        <div className="panel-header-actions">
          <span className="status-badge">
            {isFiltering ? `${filtered.length} de ${total}` : total} pendente{total !== 1 ? "s" : ""}
          </span>
          {selected.size > 0 ? (
            <button
              className="button button-primary button-sm"
              disabled={sendingAll || selectedEligible.length === 0}
              onClick={() => handleSendBatch(selectedEligible.map((inv) => inv.id), "selecionados")}
            >
              {sendingAll ? "Enviando…" : `Enviar selecionados (${selectedEligible.length})`}
            </button>
          ) : (
            <button
              className="button button-primary button-sm"
              disabled={sendingAll || eligibleFiltered.length === 0}
              onClick={() => handleSendBatch(eligibleFiltered.map((inv) => inv.id), "visíveis")}
            >
              {sendingAll ? "Enviando…" : `Enviar todos (${eligibleFiltered.length})`}
            </button>
          )}
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
          <option value="not_responded">Não respondidos (todos)</option>
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
        <input
          type="date"
          className="bulk-filter-date"
          title="Data de cadastro — de"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          className="bulk-filter-date"
          title="Data de cadastro — até"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        {(dateFrom || dateTo) && (
          <button
            className="button button-ghost button-sm"
            onClick={() => { setDateFrom(""); setDateTo(""); }}
          >
            Limpar datas
          </button>
        )}
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <p className="bulk-empty">Nenhum convite encontrado para os filtros aplicados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    title="Selecionar todos visíveis elegíveis"
                  />
                </th>
                <th>Cliente</th>
                <th>Sigla</th>
                <th>E-mail</th>
                <th>Consultor</th>
                <th>Contrato</th>
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
                const isEligible = (status === "pending" || status === "failed") && !noEmail;
                const isChecked  = selected.has(invite.id);

                return (
                  <tr key={invite.id} className={isSent ? "bulk-row-done" : isChecked ? "bulk-row-selected" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={!isEligible}
                        onChange={() => toggleSelect(invite.id)}
                      />
                    </td>
                    <td>{invite.clientName}</td>
                    <td><code className="bulk-code">{invite.clientCode || "—"}</code></td>
                    <td>{invite.clientEmail || <em className="bulk-no-email">sem e-mail</em>}</td>
                    <td>{invite.advisor}</td>
                    <td className="bulk-date">{invite.contractDate ? new Date(invite.contractDate).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—"}</td>
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
