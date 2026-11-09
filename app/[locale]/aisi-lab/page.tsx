import Link from "@/components/SmartLink";
import { getDict, getPlay } from "@/content";
import { Playground } from "@/components/Playground";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { readiness, site } from "@/lib/site";
import { hotelMetrics } from "@/lib/metrics";
import { PageHero, Section, List } from "@/components/Section";
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
  const tourLang = ["ru", "en", "ka"].includes(locale) ? locale : "en";
  const tourHref = `${site.presentation}?lang=${tourLang}`;

  return (
    <>
      <PageHero eyebrow={h.hero.eyebrow} title={h.hero.title} lead={h.hero.lead}>
        <div style={{ margin: "20px 0 28px" }}><Status r={readiness.hotels} d={d} /></div>
        <div className="btn-row">
          <Link className="btn btn-primary" href={`${href(locale, "contact")}?topic=1`}>{h.hero.demo}</Link>
          <a className="hero-link" href={tourHref} target="_blank" rel="noopener">{h.hero.tour} ↗</a>
          <Link className="hero-link" href={href(locale, "tiflis")}>{d.home.example.link} →</Link>
        </div>
        <div className="ah-facts">
          {h.facts.map(([v, t]) => (
            <div key={v}><b>{v}</b><span>{t}</span></div>
          ))}
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

      <Section id="levels" title={h.levels.title} intro={h.levels.text}>
        <div className="ah-levels">
          {h.levels.items.map(([code, name, text], i) => (
            <div key={code} className="card ah-level">
              <div className="ah-level-top">
                <span className="ah-level-code">{code}</span>
                <span className="ah-meter" aria-hidden="true">{[0, 1, 2].map((k) => <i key={k} className={k <= i ? "on" : ""} />)}</span>
              </div>
              <h3>{name}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: 24 }}>{h.levels.note}</p>
      </Section>

      <Section id="features" title={h.caps.title} intro={h.caps.text} alt>
        {h.caps.groups.map((g) => (
          <div key={g.title} className="ah-group">
            <p className="eyebrow">{g.title}</p>
            <div className={`grid ${g.items.length % 3 === 0 ? "g3" : "g4"}`}>
              {g.items.map(([icon, st, title, text]) => (
                <div key={title} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <IconTile name={icon as IconName} />
                    <span className={`badge ${st === "live" ? "badge-pilot" : "badge-demo"}`}>{st === "live" ? h.caps.live : h.caps.module}</span>
                  </div>
                  <h3 style={{ marginTop: 6 }}>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title={d.landing.play.title} intro={d.landing.play.text}>
        <Playground p={getPlay(locale).play} locale={locale} tabs={["hotel"]} />
      </Section>

      <Section id="pricing" title={h.tariffs.title} intro={h.tariffs.text} alt>
        <div className="ah-plans">
          {h.tariffs.items.map((t) => (
            <div key={t.name} className="card ah-plan">
              <p className="ah-plan-name">{t.name}</p>
              <p className="ah-plan-price"><b>{t.price}</b> <span>{h.tariffs.per}</span></p>
              <p className="ah-plan-lead">{t.lead}</p>
              <List items={t.points} />
              <p className="ah-plan-calls"><span>{h.tariffs.calls}</span><b>{t.minutes}</b></p>
            </div>
          ))}
        </div>
        <ul className="ah-notes">
          {h.tariffs.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </Section>

      <Section id="onboarding" title={h.onboarding.title} intro={h.onboarding.text}>
        <ol className="ah-steps">
          {h.onboarding.steps.map(([t, p], i) => (
            <li key={t} className="card">
              <span className="ah-step-n">{i + 1}</span>
              <div><h3>{t}</h3><p>{p}</p></div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={h.persona.title} intro={h.persona.text} alt>
        <div className="chips">{h.persona.items.map((it) => <span key={it}>{it}</span>)}</div>
        <div className="card ah-family">
          <h3>{h.persona.family}</h3>
          <div className="chips">{h.persona.products.map((it) => <span key={it}>{it}</span>)}</div>
          <p className="muted" style={{ margin: 0 }}>{h.persona.familyNote}</p>
        </div>
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

      <section className="band band-dark">
        <div className="wrap final3">
          <div>
            <h2>{h.next.title}</h2>
            <p>{h.next.text}</p>
          </div>
          <div className="final3-actions">
            <a className="btn btn-primary" href={tourHref} target="_blank" rel="noopener">{h.next.tour} ↗</a>
            <Link className="final3-link" href={`${href(locale, "contact")}?topic=1`}>{h.hero.demo} →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
