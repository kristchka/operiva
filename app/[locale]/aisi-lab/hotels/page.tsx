import Link from "@/components/SmartLink";
import { getDict, getPlay } from "@/content";
import { Playground } from "@/components/Playground";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { readiness } from "@/lib/site";
import { hotelMetrics } from "@/lib/metrics";
import { PageHero, Section, List, PageCta } from "@/components/Section";
import { Status } from "@/components/Status";
import { HeroDemo } from "@/components/HeroDemo";
import { IconTile, type IconName } from "@/components/Icon";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "hotels");
}

export default async function HotelsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const h = d.hotels;
  const pick = (r: Record<string, string>) => r[locale] ?? r.en ?? Object.values(r)[0];

  return (
    <>
      <PageHero eyebrow={h.hero.eyebrow} title={h.hero.title} lead={h.hero.lead}>
        <div style={{ margin: "20px 0 28px" }}><Status r={readiness.hotels} d={d} /></div>
        <div className="btn-row">
          <Link className="btn btn-primary" href={`${href(locale, "contact")}?topic=1`}>{h.hero.demo}</Link>
          <Link className="hero-link" href={href(locale, "tiflis")}>{d.home.example.link} →</Link>
        </div>
        <HeroDemo m={d.mock} demoLabel={d.ui.status.demo} />
      </PageHero>

      <Section alt>
        <div className="grid g3">
          {[h.guest, h.team, h.manager].map((b, i) => (
            <div key={b.title} className="card">
              <IconTile name={(["user", "flow", "grid"] as IconName[])[i]} />
              <h3 style={{ marginTop: 6 }}>{b.title}</h3>
              <List items={b.points} />
            </div>
          ))}
        </div>
      </Section>

      <Section title={d.landing.play.title} intro={d.landing.play.text}>
        <Playground p={getPlay(locale).play} locale={locale} tabs={["hotel"]} />
      </Section>

      <Section title={h.booking.title} intro={h.persona.text} alt>
        <div className="grid g3">
          {h.booking.items.map(([t, p]) => (
            <div key={t} className="card"><h3>{t}</h3><p>{p}</p></div>
          ))}
        </div>
        <div className="chips">{h.persona.items.map((it) => <span key={it}>{it}</span>)}</div>
        <p className="note" style={{ marginTop: 24 }}>{h.booking.note}</p>
      </Section>

      <Section id="checks" title={h.checks.title} intro={h.checks.text}>
        {hotelMetrics.length === 0 ? (
          <div className="card" style={{ maxWidth: 760 }}><p style={{ margin: 0 }}>{h.checks.empty}</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>{h.checks.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
              <tbody>
                {hotelMetrics.map((m, i) => (
                  <tr key={i}>
                    <td>{pick(m.name)}</td>
                    <td>{m.env === "pilot" ? h.checks.envPilot : h.checks.envTest}</td>
                    <td>{m.date}</td>
                    <td>{pick(m.scope)}</td>
                    <td>{pick(m.source)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: 32, maxWidth: 760 }}><List items={h.checks.limits} /></div>
      </Section>

      <PageCta title={h.next.title} text={h.next.text} cta={{ href: `${href(locale, "contact")}?topic=1`, label: h.hero.demo }} link={{ href: `${href(locale, "contact")}?topic=0`, label: h.hero.discuss }} />
    </>
  );
}
