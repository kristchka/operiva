"use client";

import Link from "@/components/SmartLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { href, type Locale, type RouteKey } from "@/lib/i18n";
import type { Dict } from "@/content";
import { LangSwitcher } from "./LangSwitcher";

const NAV: { key: RouteKey; label: keyof Dict["ui"]["nav"] }[] = [
  { key: "lab", label: "lab" },
  { key: "aisi", label: "aisi" },
  { key: "workforce", label: "workforce" },
  { key: "method", label: "method" },
  { key: "cases", label: "cases" },
  { key: "company", label: "company" },
];

export function Header({ locale, ui }: { locale: Locale; ui: Dict["ui"] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (k: RouteKey) => {
    const p = href(locale, k).replace(/\/index\.html$/, "");
    const cur = (typeof window !== "undefined" ? window.location.pathname : pathname).replace(/\/index\.html$/, "").replace(/\/$/, "");
    return cur === p || cur.endsWith(p) || cur.startsWith(p + "/");
  };

  return (
    <header className="header">
      <div className="wrap header-in">
        <Link href={href(locale, "home")} className="logo" aria-label="OPERIVA, AISI LAB">
          <span className="logo-mark" aria-hidden />
          <b>OPERIVA</b>
          <span className="logo-sub">AISI LAB</span>
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.key} href={href(locale, n.key)} aria-current={isActive(n.key) ? "page" : undefined}>
              {ui.nav[n.label]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LangSwitcher locale={locale} label={ui.language} />
          <Link href={href(locale, "contact")} className="btn btn-primary header-cta">
            {ui.cta}
          </Link>
          <button className="burger" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((v) => !v)}>
            {open ? ui.close : ui.menu}
          </button>
        </div>
      </div>
      <div id="mobile-nav" className="mobile-nav" data-open={open}>
        <div className="wrap">
          {NAV.map((n) => (
            <Link key={n.key} href={href(locale, n.key)} aria-current={isActive(n.key) ? "page" : undefined}>
              {ui.nav[n.label]}
            </Link>
          ))}
          <Link href={href(locale, "contact")} className="btn btn-primary">
            {ui.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
