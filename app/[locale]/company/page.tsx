import { Icon } from "@/components/Icon";
import Link from "@/components/SmartLink";
import { getDict } from "@/content";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { site } from "@/lib/site";
import { PageHero, Section, List, PageCta } from "@/components/Section";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "company");
}

export default async function CompanyPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const c = d.company;

  return (
    <>
      <PageHero {...c.hero} />
      <Section alt>
        <div className="grid g2">
          <div className="card">
            <h3>{c.mission.title}</h3>
            <p className="lead" style={{ fontSize: "1.15rem" }}>{c.mission.text}</p>
          </div>
          <div className="card">
            <h3>{c.own.title}</h3>
            <List items={c.own.items} />
          </div>
        </div>
      </Section>
      <Section title={c.data.title}>
        <div className="trust3">
          {d.landing.trust.items.map((t) => <div key={t}><Icon name="check" size={20} />{t}</div>)}
        </div>
        <div style={{ marginTop: 28 }}><Link className="arrow-link" href={href(locale, "privacy")}>{c.data.link} →</Link></div>
      </Section>
      <Section title={c.legal.title} alt>
        <dl className="rows" style={{ maxWidth: 760 }}>
          <div className="row"><dt>{c.legal.entity}</dt><dd>{site.legalEntity}</dd></div>
          <div className="row"><dt>{c.legal.location}</dt><dd>{d.contact.location}</dd></div>
          {site.email && (
            <div className="row"><dt>{d.contact.emailLabel}</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
          )}
        </dl>
      </Section>
      <PageCta title={d.landing.final.title} text={d.landing.final.text} cta={{ href: href(locale, "contact"), label: d.landing.final.cta }} />
    </>
  );
}
