export const locales = ["ru", "en", "de", "es", "it", "fr", "ka", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export const localeNames: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  fr: "Français",
  ka: "ქართული",
  pt: "Português",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Заменяет код языка в текущем пути, сохраняя раздел. */
export function swapLocale(fullPath: string, next: Locale): string {
  if (process.env.NEXT_PUBLIC_CLEAN_URLS === "1") {
    const parts = fullPath.split("/").filter(Boolean);
    if (parts.length && isLocale(parts[0])) parts.shift();
    if (parts.length && parts[parts.length - 1] === "index.html") parts.pop();
    if (next !== defaultLocale) parts.unshift(next);
    return "/" + parts.join("/");
  }
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pathname = bp && fullPath.startsWith(bp) ? fullPath.slice(bp.length) || "/" : fullPath;
  const parts = pathname.split("/");
  // Ищем сегмент языка в любом месте пути: сайт может лежать во вложенной папке хостинга.
  const i = parts.findIndex((x, n) => n > 0 && isLocale(x));
  if (i > 0) parts[i] = next;
  else parts.splice(1, 0, next);
  return (bp && fullPath.startsWith(bp) ? bp : "") + (parts.join("/") || `/${next}`);
}

// Адреса совпадают с действующим operiva.tech (на 12.08.2026) и макетом от 21.10:
// прежние страницы сохраняют URL, новые получают свои.
export const routes = {
  home: "",
  lab: "/laboratory",
  aisi: "/products",
  hotels: "/aisi-lab",
  workforce: "/workforce",
  method: "/implementation",
  gov: "/governance",
  cases: "/cases",
  tiflis: "/cases/tiflis",
  company: "/company",
  contact: "/contact",
  privacy: "/data",
} as const;

export type RouteKey = keyof typeof routes;

/** В статической версии (STATIC_EXPORT) ссылки ведут прямо на файлы index.html. */
export const isStaticSite = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
/**
 * Сборка для operiva.tech (Cloudflare Pages): русский без префикса, остальные языки — /en, /de…,
 * адреса без «.html» и без слеша в конце, как на действующем сайте.
 */
export const cleanUrls = process.env.NEXT_PUBLIC_CLEAN_URLS === "1";
/** Подпапка сайта на хостинге (GitHub Pages). Для обычных ссылок <a> добавляем её сами. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Префикс пути до папки языка на текущем хостинге (для статической версии в браузере). */
function runtimePrefix(): string {
  if (typeof window === "undefined") return basePath;
  const parts = window.location.pathname.split("/");
  const i = parts.findIndex((x, n) => n > 0 && isLocale(x));
  return i > 0 ? parts.slice(0, i).join("/") : basePath;
}

export function href(locale: Locale, key: RouteKey, hash?: string) {
  if (cleanUrls) {
    const p = `${locale === defaultLocale ? "" : `/${locale}`}${routes[key]}` || "/";
    return `${p}${hash ? `#${hash}` : ""}`;
  }
  const path = `${isStaticSite ? runtimePrefix() : ""}/${locale}${routes[key]}${isStaticSite ? "/index.html" : ""}`;
  return `${path}${hash ? `#${hash}` : ""}`;
}
