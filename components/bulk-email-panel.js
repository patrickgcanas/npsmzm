"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { advisors, buildInviteMessage, INVITE_SUBJECT } from "@/lib/survey";

function buildMailto(invite, appUrl) {
  const inviteUrl = `${appUrl}/survey/${invite.token}`;
  const body = buildInviteMessage({ clientName: invite.clientName, inviteUrl });
  return `mailto:${encodeURIComponent(invite.clientEmail)}?subject=${encodeURIComponent(INVITE_SUBJECT)}&body=${encodeURIComponent(body)}`;
}

export function BulkEmailPanel({ pendingInvites, appUrl }) {
  const [opened, setOpened] = useState(new Set());
  const [selected, setSelected] = useState(new Set());
  const [clearing, setClearing] = useState(false);
  const [advisorFilter, setAdvisorFilter] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return pendingInvites.filter((invite) => {
      const matchesAdvisor = !advisorFilter || invite.advisor === advisorFilter;
      const matchesSearch =
        !q ||
        invite.clientName.toLowerCase().includes(q) ||
        (invite.clientCode || "").toLowerCase().includes(q);
      return matchesAdvisor && matchesSearch;
    });
  }, [pendingInvites, advisorFilter, search]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((i) => selected.has(i.id));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((i) => next.delete(i.id));
        return next;
      });
    } else {
      setSelected((prev) => new Set([...prev, ...filtered.map((i) => i.id)]));
    }
  }

  function toggleOne(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function markOpened(id) {
    setOpened((prev) => new Set([...prev, id]));
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

  const total = pendingInvites.length;
  const openedCount = opened.size;
  const selectedCount = selected.size;
  const isFiltering = advisorFilter || search.trim();

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
            Selecione os clientes, filtre por consultor ou sigla e envie.
            {openedCount > 0 && (
              <span className="bulk-progress"> {openedCount} de {total} aberto{openedCount !== 1 ? "s" : ""}.</span>
            )}
          </p>
        </div>
        <div className="panel-header-actions">
          <span className="status-badge">
            {isFiltering ? `${filtered.length} de ${total}` : total} pendente{total !== 1 ? "s" : ""}
          </span>
          {selectedCount > 0 && (
            <button className="button button-primary button-sm" disabled title="Disponível após integração com Resend">
              Enviar {selectedCount} selecionado{selectedCount !== 1 ? "s" : ""}
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
                <th className="col-check">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    title="Selecionar todos visíveis"
                  />
                </th>
                <th>Cliente</th>
                <th>Sigla</th>
                <th>E-mail</th>
                <th>Consultor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invite) => (
                <tr key={invite.id} className={opened.has(invite.id) ? "bulk-row-done" : ""}>
                  <td className="col-check">
                    <input
                      type="checkbox"
                      checked={selected.has(invite.id)}
                      onChange={() => toggleOne(invite.id)}
                    />
                  </td>
                  <td>{invite.clientName}</td>
                  <td><code className="bulk-code">{invite.clientCode || "—"}</code></td>
                  <td>{invite.clientEmail}</td>
                  <td>{invite.advisor}</td>
                  <td>
                    <a
                      className={`button button-secondary button-sm${opened.has(invite.id) ? " bulk-btn-done" : ""}`}
                      href={buildMailto(invite, appUrl)}
                      onClick={() => markOpened(invite.id)}
                    >
                      {opened.has(invite.id) ? "Reabrir" : "Abrir e-mail"}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
