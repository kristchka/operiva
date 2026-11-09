import Link from "@/components/SmartLink";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content";
import { site } from "@/lib/site";

export function Footer({ locale, d }: { locale: Locale; d: Dict }) {
  const f = d.ui.footer;
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div>
          <Link href={href(locale, "home")} className="logo">
            <span className="logo-mark" aria-hidden />
            <b>OPERIVA</b>
          </Link>
          <p style={{ marginTop: 14, maxWidth: 360 }}>{f.tagline}</p>
          <p className="muted small">
            {f.legal}, {f.location}
            {site.email && (
              <>
                <br />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </>
            )}
          </p>
        </div>
        <ul>
          <li><Link href={href(locale, "lab")}>{d.ui.nav.lab}</Link></li>
          <li><Link href={href(locale, "aisi")}>{d.ui.nav.aisi}</Link></li>
          <li><Link href={href(locale, "workforce")}>{d.ui.nav.workforce}</Link></li>
          <li><Link href={href(locale, "method")}>{d.ui.nav.method}</Link></li>
        </ul>
        <ul>
          <li><Link href={href(locale, "cases")}>{d.ui.nav.cases}</Link></li>
          <li><Link href={href(locale, "company")}>{d.ui.nav.company}</Link></li>
          <li><Link href={href(locale, "contact")}>{f.contact}</Link></li>
          <li><Link href={href(locale, "privacy")}>{f.privacy}</Link></li>
        </ul>
        <p className="timing">* {d.ui.timingNote}<br />{f.rights}</p>
      </div>
    </footer>
  );
}
