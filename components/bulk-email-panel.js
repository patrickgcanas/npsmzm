"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildInviteMessage, INVITE_SUBJECT } from "@/lib/survey";

function buildMailto(invite, appUrl) {
  const inviteUrl = `${appUrl}/survey/${invite.token}`;
  const body = buildInviteMessage({ clientName: invite.clientName, inviteUrl });
  return `mailto:${encodeURIComponent(invite.clientEmail)}?subject=${encodeURIComponent(INVITE_SUBJECT)}&body=${encodeURIComponent(body)}`;
}

export function BulkEmailPanel({ pendingInvites, appUrl }) {
  const [opened, setOpened] = useState(new Set());
  const [clearing, setClearing] = useState(false);
  const router = useRouter();

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

  const openedCount = opened.size;
  const total = pendingInvites.length;

  return (
    <section className="glass-card bulk-panel-card">
      <div className="panel-header">
        <div>
          <h2>Envio em lote</h2>
          <p className="bulk-subtitle">
            Clique em <strong>Abrir e-mail</strong> em cada linha para abrir o rascunho no Outlook.
            {openedCount > 0 && (
              <span className="bulk-progress"> {openedCount} de {total} aberto{openedCount !== 1 ? "s" : ""}.</span>
            )}
          </p>
        </div>
        <div className="panel-header-actions">
          <span className="status-badge">{total} pendente{total !== 1 ? "s" : ""}</span>
          <button
            className="button button-ghost button-sm"
            disabled={clearing}
            onClick={handleClear}
          >
            {clearing ? "Limpando..." : "Limpar registros"}
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>E-mail</th>
              <th>Advisor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pendingInvites.map((invite) => (
              <tr key={invite.id} className={opened.has(invite.id) ? "bulk-row-done" : ""}>
                <td>{invite.clientName}</td>
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
      </div>
    </section>
  );
}
