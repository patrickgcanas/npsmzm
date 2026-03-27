"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/send", label: "Enviar" },
  { href: "/status", label: "Status" },
  { href: "/import", label: "Importar / Exportar" },
  { href: "/survey-model", label: "Modelo de Pesquisa" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ranking", label: "Ranking" },
];

async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}

export function SiteShell({ children }) {
  const pathname = usePathname();
  const isPublicSurvey = pathname.startsWith("/survey/");
  const isLogin = pathname === "/login";
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = navItems.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  )?.label ?? "Menu";

  if (isLogin) {
    return <>{children}</>;
  }

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
          <nav className="topnav" aria-label="Navegação principal" ref={navRef}>
            <button
              aria-expanded={open}
              className={`nav-dropdown-btn${open ? " is-open" : ""}`}
              onClick={() => setOpen((v) => !v)}
            >
              {currentLabel}
              <svg className="nav-chevron" fill="none" height="14" stroke="currentColor" strokeWidth="2" viewBox="0 0 14 14" width="14">
                <path d="M2 4.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {open && (
              <div className="nav-dropdown-panel">
                {navItems.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      className={`nav-dropdown-item${isActive ? " is-active" : ""}`}
                      href={item.href}
                      key={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="nav-dropdown-divider" />
                <button className="nav-dropdown-item nav-dropdown-logout" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </nav>
        ) : (
          <div className="public-badge">Pesquisa do cliente</div>
        )}

      </header>

      <main>{children}</main>
    </div>
  );
}
