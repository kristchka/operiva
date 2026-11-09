import Link from "@/components/SmartLink";
import { getDict, getPlay } from "@/content";
import { Playground } from "@/components/Playground";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { readiness } from "@/lib/site";
import { PageHero, Section, List, PageCta } from "@/components/Section";
import { Status } from "@/components/Status";
import { IconTile } from "@/components/Icon";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "aisi");
}

export default async function AisiPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const a = d.aisi;

  return (
    <>
      <PageHero {...a.hero} />
      <Section alt>
        <div className="grid" style={{ gap: 28 }}>
          <article id="hotels" className="card tile-feature">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><IconTile name="bed" /><Status r={readiness.hotels} d={d} /></div>
            <h2 style={{ margin: "6px 0 0" }}>{a.hotels.name}</h2>
            <p>{a.hotels.statusText}</p>
            <div className="grid g2" style={{ marginTop: 6 }}>
              <List items={a.hotels.points.slice(0, 3)} />
              <List items={a.hotels.points.slice(3)} />
            </div>
            <div className="btn-row foot">
              <Link className="btn btn-primary" href={href(locale, "hotels")}>{a.hotels.link} →</Link>
              <Link className="arrow-link" href={href(locale, "tiflis")}>{d.home.example.link} →</Link>
            </div>
          </article>
          <div className="grid g2">
            <article id="travel" className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><IconTile name="route" /><Status r={readiness.travel} d={d} /></div>
              <h2 style={{ margin: "6px 0 0", fontSize: "1.7rem" }}>{a.travel.name}</h2>
              <List items={a.travel.points} />
            </article>
            <article id="security" className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><IconTile name="shield" /><Status r={readiness.security} d={d} /></div>
              <h2 style={{ margin: "6px 0 0", fontSize: "1.7rem" }}>{a.security.name}</h2>
              <List items={a.security.points} />
              <p className="note">{a.security.note}</p>
            </article>
          </div>
        </div>
        <p className="note" style={{ marginTop: 32 }}>* {d.ui.timingNote}</p>
      </Section>
      <Section title={d.landing.play.title} intro={d.landing.play.text}>
        <Playground p={getPlay(locale).play} locale={locale} tabs={["travel", "security", "hotel"]} />
      </Section>
      <PageCta title={d.landing.final.title} text={d.landing.final.text} cta={{ href: href(locale, "contact"), label: d.landing.final.cta }} />
    </>
  );
}
