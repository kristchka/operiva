"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isStaticSite, locales, localeNames, swapLocale, type Locale } from "@/lib/i18n";

/** Компактный выбор языка: кнопка с кодом языка и выпадающий список. Раздел сохраняется. */
export function LangSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const go = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    try { document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`; } catch {}
    const target = swapLocale(isStaticSite ? window.location.pathname : pathname, next) + window.location.hash;
    if (isStaticSite) window.location.assign(target);
    else router.push(target);
  };

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${localeNames[locale]}`}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.6 3.7 5.6 3.7 9S14.5 18.4 12 21M12 3C9.5 5.6 8.3 8.6 8.3 12s1.2 6.4 3.7 9" />
        </svg>
        <span>{locale.toUpperCase()}</span>
      </button>
      {open && (
        <ul className="lang-menu" role="listbox" aria-label={label}>
          {locales.map((l) => (
            <li key={l}>
              <button type="button" role="option" aria-selected={l === locale} lang={l} onClick={() => go(l)}>
                <span>{localeNames[l]}</span>
                <small>{l.toUpperCase()}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
