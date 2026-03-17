"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/nav-link";

export function SiteShell({ children }) {
  const pathname = usePathname();
  const isPublicSurvey = pathname.startsWith("/survey/");

  return (
    <div className="page-shell">
      <header className={`topbar${isPublicSurvey ? " topbar-minimal" : ""}`}>
        <Link className="brand" href="/">
          <Image alt="Logo da MZM Wealth" className="brand-mark" height={52} src="/logo-mzm.png" width={52} />
          <div>
            <span className="brand-name">MZM Wealth</span>
            <span className="brand-tag">Pesquisa de Satisfação</span>
          </div>
        </Link>

        {!isPublicSurvey ? (
          <nav className="topnav" aria-label="Navegação principal">
            <NavLink href="/">Visão Geral</NavLink>
            <NavLink href="/send">Enviar</NavLink>
            <NavLink href="/status">Status</NavLink>
            <NavLink href="/survey-model">Modelo de Pesquisa</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/ranking">Ranking</NavLink>
          </nav>
        ) : (
          <div className="public-badge">Pesquisa do cliente</div>
        )}
      </header>

      <main>{children}</main>
    </div>
  );
}
