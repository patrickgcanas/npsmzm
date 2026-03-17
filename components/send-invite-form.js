"use client";

import { useMemo, useState } from "react";
import { advisors } from "@/lib/survey";

const initialState = {
  clientName: "",
  clientEmail: "",
  clientCode: "",
  advisor: advisors[0],
  relationshipNote: "",
};

export function SendInviteForm() {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("Aguardando dados");
  const [isPending, setIsPending] = useState(false);

  const emailLink = useMemo(() => {
    if (!result?.message) {
      return "#";
    }

    const recipient = form.clientEmail ? encodeURIComponent(form.clientEmail) : "";
    return `mailto:${recipient}?subject=${encodeURIComponent(
      "Pesquisa de satisfação | MZM Wealth"
    )}&body=${encodeURIComponent(result.message)}`;
  }, [form.clientEmail, result]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsPending(true);
    setStatus("Gerando link...");

    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Não foi possível gerar o link.");
      }

      setResult(payload);
      setStatus("Link pronto");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsPending(false);
    }
  }

  async function copyText(value) {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const temp = document.createElement("textarea");
      temp.value = value;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
    }
  }

  return (
    <section className="send-layout">
      <article className="glass-card">
        <h2>Dados do convite</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Nome do cliente
            <input
              name="clientName"
              onChange={(event) => updateField("clientName", event.target.value)}
              placeholder="Ex.: Família Andrade"
              required
              value={form.clientName}
            />
          </label>

          <label>
            E-mail
            <input
              name="clientEmail"
              onChange={(event) => updateField("clientEmail", event.target.value)}
              placeholder="cliente@exemplo.com"
              type="email"
              value={form.clientEmail}
            />
          </label>

          <label>
            Sigla do cliente
            <input
              name="clientCode"
              onChange={(event) => updateField("clientCode", event.target.value.replace(/[^A-Za-z0-9]/g, ""))}
              placeholder="Ex.: ABC123"
              value={form.clientCode}
            />
          </label>

          <label>
            Advisor responsável
            <select
              name="advisor"
              onChange={(event) => updateField("advisor", event.target.value)}
              value={form.advisor}
            >
              {advisors.map((advisor) => (
                <option key={advisor} value={advisor}>
                  {advisor}
                </option>
              ))}
            </select>
          </label>

          <label className="field-span">
            Observação para personalização
            <textarea
              name="relationshipNote"
              onChange={(event) => updateField("relationshipNote", event.target.value)}
              placeholder="Ex.: cliente recém-onboarded, reunião semestral concluída, foco em sucessão."
              rows={4}
              value={form.relationshipNote}
            />
          </label>

          <div className="button-row field-span">
            <button className="button button-primary" disabled={isPending} type="submit">
              {isPending ? "Gerando..." : "Gerar link"}
            </button>
            {result?.inviteUrl ? (
              <a className="button button-secondary" href={result.inviteUrl} rel="noreferrer" target="_blank">
                Abrir pesquisa
              </a>
            ) : null}
          </div>
        </form>
      </article>

      <article className="glass-card invite-output">
        <div className="panel-header">
          <h2>Link gerado</h2>
          <span className="status-badge">{status}</span>
        </div>

        <label className="field-stack">
          URL da pesquisa
          <input readOnly value={result?.inviteUrl || "Preencha os dados e clique em gerar link."} />
        </label>

        <label className="field-stack">
          Mensagem sugerida
          <textarea readOnly rows={10} value={result?.message || "A mensagem aparecerá aqui após gerar o link."} />
        </label>

        <div className="button-row">
          <button className="button button-secondary" onClick={() => copyText(result?.inviteUrl)} type="button">
            Copiar link
          </button>
          <button className="button button-secondary" onClick={() => copyText(result?.message)} type="button">
            Copiar mensagem
          </button>
          <a className="button button-ghost" href={emailLink}>
            Abrir e-mail
          </a>
        </div>
      </article>
    </section>
  );
}
