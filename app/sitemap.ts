export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { locales, routes, href, type RouteKey } from "@/lib/i18n";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(routes) as RouteKey[]).flatMap((key) =>
    locales.map((l) => ({
      url: `${site.url}${href(l, key)}`,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}${href(x, key)}`])) },
    })),
  );
}
