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
  const [opening, setOpening] = useState(false);
  const [openedCount, setOpenedCount] = useState(0);
  const [done, setDone] = useState(false);

  function openAllEmails() {
    setOpening(true);
    setDone(false);
    setOpenedCount(0);

    pendingInvites.forEach((invite, index) => {
      setTimeout(() => {
        window.open(buildMailto(invite, appUrl), "_blank");
        setOpenedCount(index + 1);
        if (index === pendingInvites.length - 1) {
          setOpening(false);
          setDone(true);
        }
      }, index * 600);
    });
  }

  return (
    <section className="glass-card bulk-panel">
      <div className="bulk-panel-left">
        <strong>Envio em lote</strong>
        <p>
          {done
            ? `${pendingInvites.length} rascunho${pendingInvites.length !== 1 ? "s" : ""} aberto${pendingInvites.length !== 1 ? "s" : ""} no Outlook. Revise e clique em Enviar em cada um.`
            : `${pendingInvites.length} cliente${pendingInvites.length !== 1 ? "s" : ""} com convite pendente e e-mail cadastrado.`}
        </p>
      </div>
      <button
        className="button button-primary"
        disabled={opening}
        onClick={openAllEmails}
        type="button"
      >
        {opening
          ? `Abrindo ${openedCount} de ${pendingInvites.length}...`
          : done
          ? "Reabrir rascunhos"
          : `Abrir ${pendingInvites.length} rascunho${pendingInvites.length !== 1 ? "s" : ""} no Outlook`}
      </button>
    </section>
  );
}
