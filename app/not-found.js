import Link from "next/link";

export default function NotFound() {
  return (
    <section className="empty-state glass-card">
      <span className="section-label">Não encontrado</span>
      <h1>Este link não está mais disponível.</h1>
      <p>A pesquisa pode ter sido removida, já respondida ou o token informado não existe na base atual.</p>
      <Link className="button button-primary" href="/">
        Voltar para a visão geral
      </Link>
    </section>
  );
}
