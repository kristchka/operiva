import type { Metadata } from "next";
import { getDict } from "@/content";
import { href, isLocale, locales, defaultLocale, type Locale, type RouteKey } from "./i18n";
import { site } from "./site";

export type LocaleParams = { params: Promise<{ locale: string }> };

export async function resolveLocale(params: LocaleParams["params"]): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : defaultLocale;
}

export function pageMeta(locale: Locale, key: RouteKey): Metadata {
  const d = getDict(locale);
  const page = key === "home" ? null : d.meta.pages[key as keyof typeof d.meta.pages];
  const title = page ? `${page[0]} | AISI LAB` : d.meta.title;
  const description = page ? page[1] : d.meta.description;
  const languages = Object.fromEntries(locales.map((l) => [l, href(l, key)]));
  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: { canonical: href(locale, key), languages: { ...languages, "x-default": href(defaultLocale, key) } },
    openGraph: { title, description, siteName: "OPERIVA | AISI LAB", locale, type: "website" },
  };
}
