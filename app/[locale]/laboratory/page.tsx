import { getDict } from "@/content";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { readiness } from "@/lib/site";
import { PageHero, Section, List, PageCta } from "@/components/Section";
import { Status } from "@/components/Status";
import { NalOrb } from "@/components/NalOrb";
import { Playground } from "@/components/Playground";
import { getPlay } from "@/content";
import { IconTile } from "@/components/Icon";
import Link from "@/components/SmartLink";
import { href } from "@/lib/i18n";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "lab");
}

export default async function LabPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const l = d.lab;
  const p = l.products;
  const nalName = locale === "ru" ? "НАЛ" : "NAL";

  return (
    <>
      <PageHero {...l.hero} />

      <section id="nal" className="band band-dark">
        <div className="wrap nal3">
          <div>
            <p className="eyebrow eyebrow-dark">{l.nal.eyebrow}</p>
            <h2>{l.nal.title}</h2>
            <p style={{ fontSize: "1.1rem" }}>{l.nal.text}</p>
            <div className="nal3-items">
              {l.nal.types.map(([t, desc]) => <div key={t}><b>{t}</b><span>{desc}</span></div>)}
            </div>
            <p className="small" style={{ marginTop: 20, color: "#b8c3e0" }}>{l.nal.facts.join(". ")}. {l.nal.note}</p>
          </div>
          <NalOrb labels={l.nal.types.map((t) => t[0])} center={nalName} />
        </div>
      </section>

      <Section title={d.landing.play.title} intro={d.landing.play.text}>
        <Playground p={getPlay(locale).play} locale={locale} tabs={["memory", "translator"]} />
      </Section>

      <Section title={p.title} alt>
        <div className="grid" style={{ gap: 28 }}>
          <article id="assistant" className="card tile-feature">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><IconTile name="mic" /><Status r={readiness.assistant} d={d} showNoDate /></div>
            <h3>{p.assistant.name}</h3>
            <p>{p.assistant.text}</p>
            <List items={p.assistant.points} />
            <p>{p.assistant.uses}</p>
            <p className="muted small">{p.assistant.link}</p>
          </article>
          <div className="grid g2">
            <article id="translator" className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><IconTile name="globe" /><Status r={readiness.translator} d={d} /></div>
              <h3>{p.translator.name}</h3>
              <p>{p.translator.text}</p>
              <List items={p.translator.points} />
              <p className="note">{p.translator.note}</p>
            </article>
            <article id="legacy" className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><IconTile name="heart" /><Status r={readiness.legacy} d={d} /></div>
              <h3>{p.legacy.name}</h3>
              <p>{p.legacy.text}</p>
              <List items={p.legacy.points} />
              <p className="note">{p.legacy.note}</p>
            </article>
          </div>
        </div>
        <p className="note" style={{ marginTop: 32 }}>* {d.ui.timingNote}</p>
      </Section>
      <PageCta title={d.landing.final.title} text={d.landing.final.text} cta={{ href: `${href(locale, "contact")}?topic=3`, label: d.home.contact.options[3][0] }} link={{ href: href(locale, "aisi"), label: d.home.hero.links.products }} />
    </>
  );
}
