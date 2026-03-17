import { ImportClient } from "@/components/import-client";

export default function ImportPage() {
  return (
    <div className="page-inner">
      <div className="section-header compact">
        <span className="eyebrow">Integração Salesforce</span>
        <h1>Importar e Exportar</h1>
        <p>
          Importe uma lista de clientes via planilha para criar convites em lote. Exporte os dados do app para
          alimentar o Salesforce.
        </p>
      </div>
      <ImportClient />
    </div>
  );
}
