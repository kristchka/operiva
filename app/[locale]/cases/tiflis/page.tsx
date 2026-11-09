import Link from "@/components/SmartLink";
import { getDict } from "@/content";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { readiness } from "@/lib/site";
import { PageHero, Section, List, PageCta } from "@/components/Section";
import { Status } from "@/components/Status";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "tiflis");
}

export default async function TiflisPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const t = d.tiflis;

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} title={t.hero.title} lead={t.hero.lead}>
        <div style={{ marginTop: 20 }}><Status r={readiness.hotels} d={d} /></div>
      </PageHero>
      <Section alt>
        <dl className="rows">
          {t.sections.map(([k, v], i) => (
            <div key={k} className="row">
              <dt><span className="num">{String(i + 1).padStart(2, "0")}</span><br />{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section>
        <div className="grid g2">
          <div className="card">
            <span className="num">07</span>
            <h3>{t.results.title}</h3>
            <p>{t.results.text}</p>
          </div>
          <div className="card">
            <span className="num">08</span>
            <h3>{t.limits.title}</h3>
            <List items={t.limits.items} />
          </div>
        </div>
      </Section>
      <PageCta title={d.hotels.next.title} text={d.hotels.next.text} cta={{ href: `${href(locale, "contact")}?topic=1`, label: d.hotels.hero.demo }} link={{ href: href(locale, "hotels"), label: d.aisi.hotels.name }} />
    </>
  );
}
