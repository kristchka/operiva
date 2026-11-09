"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Плавно показывает элементы с классом .reveal при прокрутке. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    // Автоматически анимируем карточки внутренних страниц, которые ещё ниже экрана.
    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>("main .section .card, main .section .section-head, main .step, main .dialog, main .table-wrap").forEach((el, i) => {
      if (el.classList.contains("reveal") || el.closest(".reveal")) return;
      if (el.getBoundingClientRect().top > vh * 0.92) {
        el.classList.add("reveal");
        el.style.setProperty("--d", `${(i % 4) * 70}ms`);
      }
    });
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
