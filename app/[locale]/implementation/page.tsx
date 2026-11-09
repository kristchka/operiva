import Link from "@/components/SmartLink";
import { getDict } from "@/content";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { PageHero, Section, PageCta } from "@/components/Section";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "method");
}

export default async function MethodPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const m = d.method;

  return (
    <>
      <PageHero {...m.hero} />
      <Section>
        <ol className="steps">
          {m.steps.map(([title, text, client], i) => (
            <li key={title} className="step">
              <span className="n">{i + 1}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
              <div className="client"><b>{m.clientLabel}</b>{client}</div>
            </li>
          ))}
        </ol>
      </Section>
      <PageCta title={d.landing.final.title} text={d.landing.final.text} cta={{ href: `${href(locale, "contact")}?topic=0`, label: d.landing.final.cta }} link={{ href: href(locale, "gov"), label: d.ui.nav.gov }} />
    </>
  );
}
