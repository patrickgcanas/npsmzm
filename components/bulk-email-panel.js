"use client";

import { useState } from "react";

const SUBJECT = "Pesquisa de satisfação | MZM Wealth";

function buildMessage(clientName, inviteUrl) {
  return `Olá, ${clientName}.\n\nAqui é a Ariane, responsável pelo setor de Client Experience da MZM Wealth. Preparamos uma pesquisa breve para entender como você percebe nossa atuação e sua satisfação com a experiência consultiva.\n\nSeu retorno nos ajudará a evoluir continuamente o padrão de atendimento, a satisfação percebida e a experiência consultiva.\n\nVocê pode responder neste link:\n${inviteUrl}\n\nA pesquisa leva cerca de 3 minutos.\n\nMuito obrigado,\nAriane Siciliano\nMZM Wealth`;
}

function buildMailto(invite, appUrl) {
  const inviteUrl = `${appUrl}/survey/${invite.token}`;
  const body = buildMessage(invite.clientName, inviteUrl);
  return `mailto:${encodeURIComponent(invite.clientEmail)}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`;
}

export function BulkEmailPanel({ pendingInvites, appUrl }) {
  const [opened, setOpened] = useState(new Set());

  function markOpened(id) {
    setOpened((prev) => new Set([...prev, id]));
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
        <span className="status-badge">{total} pendente{total !== 1 ? "s" : ""}</span>
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
