import Link from "@/components/SmartLink";
import { getDict, getPlay } from "@/content";
import { href, type Locale } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/meta";
import { readiness } from "@/lib/site";
import { NalOrb } from "@/components/NalOrb";
import { HeroHead } from "@/components/HeroHead";
import { Playground } from "@/components/Playground";
import { Icon, type IconName } from "@/components/Icon";

type Offer = { icon: IconName; r: (typeof readiness)[keyof typeof readiness] | null; href: (l: Locale) => string };
const OFFERS: Record<string, Offer> = {
  hotels: { icon: "bed", r: readiness.hotels, href: (l) => href(l, "hotels") },
  sites: { icon: "chat", r: null, href: (l) => `${href(l, "contact")}?topic=2` },
  workforce: { icon: "grid", r: null, href: (l) => href(l, "workforce") },
  security: { icon: "shield", r: readiness.security, href: (l) => href(l, "aisi", "security") },
  assistant: { icon: "mic", r: readiness.assistant, href: (l) => href(l, "lab", "assistant") },
  translator: { icon: "globe", r: readiness.translator, href: (l) => href(l, "lab", "translator") },
  travel: { icon: "route", r: readiness.travel, href: (l) => href(l, "aisi", "travel") },
  legacy: { icon: "heart", r: readiness.legacy, href: (l) => href(l, "lab", "legacy") },
};

/** Выделяет ключевое слово заголовка цветом. */
function highlight(text: string, words: string[]) {
  const w = words.find((x) => text.includes(x));
  if (!w) return text;
  const [a, b] = text.split(w);
  return (<>{a}<span className="grad-text">{w}</span>{b}</>);
}

export default async function Home({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const h = d.home;
  const L = d.landing;
  const pl = getPlay(locale);
  const nal = locale === "ru" ? "НАЛ" : "NAL";

  return (
    <>
      {/* 1. Первый экран: кто мы, одна главная кнопка, живой помощник */}
      <section className="hero3">
        <div className="wrap hero3-grid">
          <div className="fade-in">
            <p className="eyebrow">{L.hero.eyebrow}</p>
            <h1>
              {h.hero.title.split("\n").map((line, i) => (
                <span key={i} className="hero-line">{highlight(line, ["помнит", "remembers"])}</span>
              ))}
            </h1>
            <p className="lead">{L.hero.lead}</p>
            <div className="hero3-actions">
              <Link className="btn btn-primary" href={href(locale, "contact")}>{L.hero.cta}</Link>
              <a className="hero3-link" href="#try">{L.hero.demo}</a>
            </div>
            <div className="hero3-facts">
              {L.hero.facts.map(([b, t]) => <div key={b}><b>{b}</b>{t}</div>)}
            </div>
          </div>
          <div className="fade-in-2">
            <HeroHead h={pl.head} label={L.hero.live} locale={locale} />
          </div>
        </div>
      </section>

      {/* 2. Что мы делаем */}
      <section className="band band-alt">
        <div className="wrap">
          <div className="band-head">
            <h2>{L.offers.title}</h2>
            <p>{L.offers.text}</p>
          </div>
          <div className="offers3">
            {h.hero.groups.map((g) => (
              <div key={g.title}>
                <h3>{g.title}</h3>
                <div className="offers3-list">
                  {g.items.map(([key, t]) => {
                    const o = OFFERS[key];
                    const kind = o.r ? o.r.kind : "service";
                    const tag = o.r ? (o.r.kind === "pilot" ? h.hero.tags.pilot : h.hero.tags.prototype) : h.hero.tags.service;
                    return (
                      <Link key={key} className="of3" href={o.href(locale)}>
                        <span className="of3-top">
                          <span className="of3-icon"><Icon name={o.icon} size={20} /></span>
                          <em className={`offer-tag ${kind}`}>{tag}</em>
                        </span>
                        <b>{t}</b>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <Link className="of3-custom" href={`${href(locale, "contact")}?topic=0`}>
            {L.offers.custom}
            <span>{L.offers.customLink} →</span>
          </Link>
        </div>
      </section>

      {/* 3. Попробуйте сами */}
      <section className="band" id="try">
        <div className="wrap">
          <div className="band-head">
            <h2>{L.play.title}</h2>
            <p>{L.play.text}</p>
          </div>
          <Playground p={pl.play} locale={locale} />
        </div>
      </section>

      {/* 4. Технология НАЛ */}
      <section className="band band-dark">
        <div className="wrap nal3">
          <div>
            <p className="eyebrow eyebrow-dark">{L.nal.eyebrow}</p>
            <h2>{L.nal.title}</h2>
            <p style={{ fontSize: "1.1rem" }}>{L.nal.text}</p>
            <div className="nal3-items">
              {L.nal.items.map(([b, t]) => <div key={b}><b>{b}</b><span>{t}</span></div>)}
            </div>
            <p style={{ marginTop: 24 }}><Link className="arrow-link" href={href(locale, "lab")} style={{ color: "#93b4ff" }}>{L.nal.link} →</Link></p>
          </div>
          <NalOrb center={nal} labels={L.nal.items.map((x) => x[0])} />
        </div>
      </section>

      {/* 5. Кейс */}
      <section className="band">
        <div className="wrap">
          <div className="band-head">
            <div>
              <p className="eyebrow">{L.case.eyebrow}</p>
              <h2>{L.case.title}</h2>
            </div>
            <p>{L.case.text}</p>
          </div>
          <div className="case3">
            {L.case.steps.map(([t, txt], i) => (
              <div key={t}>
                <span className="num">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{txt}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 24 }}><Link className="arrow-link" href={href(locale, "tiflis")}>{L.case.link} →</Link></p>
        </div>
      </section>

      {/* 6. Данные и доверие */}
      <section className="band band-alt">
        <div className="wrap">
          <div className="band-head"><h2>{L.trust.title}</h2></div>
          <div className="trust3">
            {L.trust.items.map((t) => <div key={t}><Icon name="check" size={20} />{t}</div>)}
          </div>
        </div>
      </section>

      {/* 7. Призыв */}
      <section className="band band-dark">
        <div className="wrap final3">
          <div>
            <h2>{L.final.title}</h2>
            <p>{L.final.text}</p>
          </div>
          <Link className="btn btn-primary" href={href(locale, "contact")}>{L.final.cta}</Link>
        </div>
      </section>
    </>
  );
}
