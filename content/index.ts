import type { Locale } from "@/lib/i18n";
import { ru, type Dict } from "./ru";
import { en } from "./en";
import { de } from "./de";
import { es } from "./es";
import { it } from "./it";
import { fr } from "./fr";
import { ka } from "./ka";
import { pt } from "./pt";
import type { Overlay } from "./overlay";

const withFallback = (o: Overlay): Dict => ({ ...en, ...o });

const dictionaries: Record<Locale, Dict> = {
  ru,
  en,
  de: withFallback(de),
  es: withFallback(es),
  it: withFallback(it),
  fr: withFallback(fr),
  ka: withFallback(ka),
  pt: withFallback(pt),
};

/** Языки, где тексты страниц пока показываются на английском. */
export const contentFallback: Record<Locale, boolean> = {
  ru: false,
  en: false,
  de: true,
  es: true,
  it: true,
  fr: true,
  ka: true,
  pt: true,
};

/**
 * Короткие фразы в карточках, списках и подзаголовках показываем без точки в конце.
 * Абзацы из нескольких предложений, реплики в диалогах, чат и формы не трогаем.
 */
const KEEP = new Set(["chat", "form", "mock", "scenarios", "meta", "ui", "privacy"]);
function tidy(v: unknown, key = ""): unknown {
  if (KEEP.has(key)) return v;
  if (typeof v === "string") {
    const single = !/[.!?…]\s+\S/.test(v);
    return single && /[^.]\.$/.test(v) ? v.slice(0, -1) : v;
  }
  if (Array.isArray(v)) return v.map((x) => tidy(x));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, tidy(x, k)]));
  return v;
}
const tidied = new Map<Locale, Dict>();

export function getDict(locale: Locale): Dict {
  if (!tidied.has(locale)) tidied.set(locale, tidy(dictionaries[locale]) as Dict);
  return tidied.get(locale)!;
}

export type { Dict };

import { playRu, type Play } from "./play.ru";
import { playEn } from "./play.en";
export type { Play };
/** Тексты демо: русский и английский, остальные языки — английский. */
export function getPlay(locale: Locale): Play {
  return locale === "ru" ? playRu : playEn;
}
