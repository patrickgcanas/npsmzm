"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";

const TEMPLATE_HEADERS = ["nome", "email", "sigla", "advisor", "contexto"];
const TEMPLATE_EXAMPLE = [
  ["João Silva", "joao@email.com", "JS001", "Daniel Mazza", "Revisão estratégica Q1"],
  ["Maria Oliveira", "maria@email.com", "MO002", "Fabio Marques", ""],
];

function downloadTemplate() {
  const rows = [TEMPLATE_HEADERS, ...TEMPLATE_EXAMPLE];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "template-clientes-mzm.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function downloadExport(endpoint, filename) {
  const a = document.createElement("a");
  a.href = endpoint;
  a.download = filename;
  a.click();
}

export function ImportClient() {
  const [rows, setRows] = useState(null);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [parseError, setParseError] = useState("");
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setParseError("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
      complete: ({ data, errors }) => {
        if (errors.length) {
          setParseError("Erro ao ler o arquivo. Verifique se é um CSV válido.");
          return;
        }
        setRows(data);
      },
    });
  }

  async function handleImport() {
    if (!rows?.length) return;
    setImporting(true);
    setResult(null);

    try {
      const res = await fetch("/api/invites/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      setResult(data);
      setRows(null);
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setResult({ error: "Erro ao comunicar com o servidor." });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="import-layout">
      {/* IMPORT SECTION */}
      <section className="glass-card import-card">
        <div className="panel-header">
          <h2>Importar clientes</h2>
          <span>CSV → Convites em lote</span>
        </div>

        <div className="import-steps">
          <div className="import-step">
            <span className="import-step-num">1</span>
            <div>
              <strong>Baixe o template</strong>
              <p>Preencha com os clientes exportados do Salesforce.</p>
              <button className="button button-secondary" onClick={downloadTemplate} type="button">
                Baixar template CSV
              </button>
            </div>
          </div>

          <div className="import-step">
            <span className="import-step-num">2</span>
            <div>
              <strong>Suba o arquivo preenchido</strong>
              <p>Colunas obrigatórias: <code>nome</code> e <code>advisor</code>.</p>
              <label className="file-upload-label">
                {fileName || "Selecionar arquivo .csv"}
                <input accept=".csv" onChange={handleFile} ref={fileRef} type="file" />
              </label>
            </div>
          </div>

          {parseError && <p className="form-error">{parseError}</p>}

          {rows?.length > 0 && (
            <div className="import-preview">
              <p className="import-preview-count">{rows.length} linha{rows.length !== 1 ? "s" : ""} encontrada{rows.length !== 1 ? "s" : ""}</p>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {TEMPLATE_HEADERS.map((h) => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {TEMPLATE_HEADERS.map((h) => <td key={h}>{row[h] || "—"}</td>)}
                      </tr>
                    ))}
                    {rows.length > 5 && (
                      <tr>
                        <td className="muted" colSpan={5}>... e mais {rows.length - 5} linha{rows.length - 5 !== 1 ? "s" : ""}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="import-step-num-row">
                <span className="import-step-num">3</span>
                <div>
                  <strong>Confirme a importação</strong>
                  <p>Os convites serão criados sem envio automático. Você pode enviá-los individualmente na aba Enviar.</p>
                  <button
                    className="button button-primary"
                    disabled={importing}
                    onClick={handleImport}
                    type="button"
                  >
                    {importing ? "Importando..." : `Importar ${rows.length} cliente${rows.length !== 1 ? "s" : ""}`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className={`import-result${result.error ? " import-result-error" : ""}`}>
              {result.error ? (
                <p>{result.error}</p>
              ) : (
                <>
                  <strong>{result.created} convite{result.created !== 1 ? "s" : ""} criado{result.created !== 1 ? "s" : ""} com sucesso.</strong>
                  {result.skipped > 0 && <p>{result.skipped} linha{result.skipped !== 1 ? "s" : ""} ignorada{result.skipped !== 1 ? "s" : ""}.</p>}
                  {result.errors?.map((e, i) => <p className="form-error" key={i}>{e}</p>)}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* EXPORT SECTION */}
      <section className="glass-card import-card">
        <div className="panel-header">
          <h2>Exportar dados</h2>
          <span>CSV → Salesforce</span>
        </div>

        <div className="import-steps">
          <div className="export-option">
            <div className="export-option-text">
              <strong>Respostas da pesquisa</strong>
              <p>
                Exporta todas as respostas com NPS, CSAT por pilar e comentários.
                Ideal para criar relatórios no Salesforce ou analisar em Excel.
              </p>
            </div>
            <button
              className="button button-secondary"
              onClick={() => downloadExport("/api/export/responses", "mzm-respostas.csv")}
              type="button"
            >
              Exportar respostas
            </button>
          </div>

          <div className="export-option">
            <div className="export-option-text">
              <strong>Status dos convites</strong>
              <p>
                Exporta todos os convites com status de abertura, preenchimento e resposta.
                Útil para acompanhar engajamento no Salesforce.
              </p>
            </div>
            <button
              className="button button-secondary"
              onClick={() => downloadExport("/api/export/invites", "mzm-convites.csv")}
              type="button"
            >
              Exportar convites
            </button>
          </div>
        </div>
      </section>

      {/* COLUMN REFERENCE */}
      <section className="glass-card import-card">
        <div className="panel-header">
          <h2>Referência de colunas</h2>
          <span>Para mapeamento no Salesforce</span>
        </div>
        <div className="column-ref-grid">
          <div className="column-ref-block">
            <strong>Template de importação</strong>
            <table>
              <thead><tr><th>Coluna</th><th>Obrigatório</th><th>Descrição</th></tr></thead>
              <tbody>
                <tr><td><code>nome</code></td><td>Sim</td><td>Nome completo do cliente</td></tr>
                <tr><td><code>email</code></td><td>Não</td><td>E-mail do cliente</td></tr>
                <tr><td><code>sigla</code></td><td>Não</td><td>ID do cliente no Salesforce (Account ID ou código interno)</td></tr>
                <tr><td><code>advisor</code></td><td>Sim</td><td>Nome exato do consultor (como cadastrado no sistema)</td></tr>
                <tr><td><code>contexto</code></td><td>Não</td><td>Nota de relacionamento para personalizar o convite</td></tr>
              </tbody>
            </table>
          </div>
          <div className="column-ref-block">
            <strong>Export de respostas</strong>
            <table>
              <thead><tr><th>Coluna</th><th>Descrição</th></tr></thead>
              <tbody>
                <tr><td><code>sigla</code></td><td>Vincule ao Account ID no Salesforce</td></tr>
                <tr><td><code>nps</code></td><td>Score 0–10</td></tr>
                <tr><td><code>csat_pct</code></td><td>% de respostas 4 ou 5</td></tr>
                <tr><td><code>na/ns/nn_media</code></td><td>Média 0–5 por pilar</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
