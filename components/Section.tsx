import type { ReactNode } from "react";
import Link from "@/components/SmartLink";

export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="hero page-hero">
      <div className="wrap">
        <p className="eyebrow fade-in">{eyebrow}</p>
        <h1 className="fade-in">{title}</h1>
        {lead && <p className="lead fade-in-2">{lead}</p>}
        <div className="fade-in-3">{children}</div>
      </div>
    </section>
  );
}

export function Section({ id, eyebrow, title, intro, alt, dark, children }: { id?: string; eyebrow?: string; title?: string; intro?: ReactNode; alt?: boolean; dark?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`band${alt ? " band-alt" : ""}${dark ? " band-dark" : ""}`}>
      <div className="wrap">
        {(eyebrow || title || intro) && (
          <div className="band-head">
            <div>
              {eyebrow && <p className={`eyebrow${dark ? " eyebrow-dark" : ""}`}>{eyebrow}</p>}
              {title && <h2>{title}</h2>}
            </div>
            {intro && <p>{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="list">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

/** Финальная тёмная полоса страницы: одна главная кнопка и, при необходимости, тихая ссылка. */
export function PageCta({ title, text, cta, link }: { title: string; text?: string; cta: { href: string; label: string }; link?: { href: string; label: string } }) {
  return (
    <section className="band band-dark">
      <div className="wrap final3">
        <div>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <div className="final3-actions">
          <Link className="btn btn-primary" href={cta.href}>{cta.label}</Link>
          {link && <Link className="final3-link" href={link.href}>{link.label} →</Link>}
        </div>
      </div>
    </section>
  );
}
