import Link from "@/components/SmartLink";
import { getDict } from "@/content";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { readiness } from "@/lib/site";
import { PageHero, Section } from "@/components/Section";
import { Status } from "@/components/Status";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "cases");
}

export default async function CasesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const c = d.cases;

  return (
    <>
      <PageHero {...c.hero} />
      <Section alt>
        <div className="grid g2">
          <Link href={href(locale, "tiflis")} className="card card-link">
            <Status r={readiness.hotels} d={d} />
            <h3>{c.tiflis.name}</h3>
            <p>{c.tiflis.summary}</p>
            <span className="foot arrow-link">{d.ui.readMore} →</span>
          </Link>
          <div className="card" style={{ borderStyle: "dashed", background: "transparent" }}>
            <p className="muted">{c.more}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
