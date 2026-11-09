import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";

/** Без языка в адресе: берём сохранённый выбор, затем язык браузера, иначе русский. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const saved = req.cookies.get("lang")?.value;
  let locale = saved && isLocale(saved) ? saved : undefined;
  if (!locale) {
    const accepted = (req.headers.get("accept-language") ?? "")
      .split(",")
      .map((p) => p.split(";")[0].trim().slice(0, 2).toLowerCase());
    locale = accepted.find((l) => (locales as readonly string[]).includes(l)) as typeof locale;
  }
  const url = req.nextUrl.clone();
  url.pathname = `/${locale ?? defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
