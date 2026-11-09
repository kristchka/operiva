import NextLink from "next/link";
import type { ComponentProps } from "react";
import { isStaticSite } from "@/lib/i18n";

/** В статической версии — обычная ссылка (полная загрузка страницы), иначе — Next Link. */
export default function Link(props: ComponentProps<typeof NextLink>) {
  if (isStaticSite) {
    const { href, prefetch: _p, replace: _r, scroll: _s, shallow: _sh, passHref: _ph, legacyBehavior: _l, locale: _lo, onNavigate: _n, ...rest } = props as ComponentProps<typeof NextLink> & Record<string, unknown>;
    return <a href={String(href)} {...(rest as ComponentProps<"a">)} />;
  }
  return <NextLink {...props} />;
}
