"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, children }) {
  const pathname = usePathname();

  return (
    <Link className={`nav-link${isActive(pathname, href) ? " is-active" : ""}`} href={href}>
      {children}
    </Link>
  );
}
