import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import "@fontsource-variable/inter";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/noto-sans-georgian";
import "../globals.css";
import { getDict, contentFallback } from "@/content";
import { isLocale, locales } from "@/lib/i18n";
import { pageMeta, type LocaleParams } from "@/lib/meta";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chat } from "@/components/Chat";
import { RevealObserver } from "@/components/Reveal";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams) {
  const { locale } = await params;
  return isLocale(locale) ? pageMeta(locale, "home") : {};
}

export default async function LocaleLayout({ children, params }: { children: ReactNode } & LocaleParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip">{d.ui.skip}</a>
        <Header locale={locale} ui={d.ui} />
        {contentFallback[locale] && d.ui.fallback && (
          <div className="fallback-note" role="note">
            <div className="wrap">{d.ui.fallback}</div>
          </div>
        )}
        <main id="main">{children}</main>
        <Footer locale={locale} d={d} />
        <RevealObserver />
        <Chat locale={locale} c={d.chat} deliveryEnabled={site.chatDeliveryEnabled} />
      </body>
    </html>
  );
}
