"use client";

import { useMemo, useState } from "react";
import { advisors } from "@/lib/survey";

export function StatusClient({ initialInvites }) {
  const [search, setSearch] = useState("");
  const [advisorFilter, setAdvisorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return initialInvites.filter((invite) => {
      const matchSearch =
        !term ||
        invite.clientName.toLowerCase().includes(term) ||
        (invite.clientCode || "").toLowerCase().includes(term);
      const matchAdvisor = advisorFilter === "all" || invite.advisor === advisorFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "responded" && invite.responded) ||
        (statusFilter === "pending" && !invite.responded);
      return matchSearch && matchAdvisor && matchStatus;
    });
  }, [initialInvites, search, advisorFilter, statusFilter]);

  const total = initialInvites.length;
  const responded = initialInvites.filter((i) => i.responded).length;
  const pending = total - responded;

  return (
    <>
      <section className="metrics-grid" style={{ marginTop: 24 }}>
        <div className="metric-card" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(22,54,51,0.1)", borderRadius: 20, padding: 18 }}>
          <span className="metric-label">Total enviados</span>
          <span className="metric-value">{total}</span>
        </div>
        <div className="metric-card" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(22,54,51,0.1)", borderRadius: 20, padding: 18 }}>
          <span className="metric-label">Respondidos</span>
          <span className="metric-value">{responded}</span>
        </div>
        <div className="metric-card" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(22,54,51,0.1)", borderRadius: 20, padding: 18 }}>
          <span className="metric-label">Pendentes</span>
          <span className="metric-value">{pending}</span>
        </div>
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
              <option value="pending">Pendente</option>
            </select>
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
                <th>Enviado em</th>
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
                    <td>{new Date(invite.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td>
                      {invite.responded ? (
                        <span className="status-badge">Respondida</span>
                      ) : (
                        <span style={{ color: "var(--text-soft)", fontSize: "0.86rem" }}>Pendente</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="muted" colSpan="5">
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
