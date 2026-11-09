import Link from "@/components/SmartLink";
import { getDict } from "@/content";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { PageHero, Section, PageCta } from "@/components/Section";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "gov");
}

export default async function GovPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const g = d.gov;

  return (
    <>
      <PageHero {...g.hero} />
      <Section alt>
        <div className="grid g4">
          {g.blocks.map(([t, p], i) => (
            <div key={t} className="card">
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h3 style={{ fontSize: "1.15rem" }}>{t}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: 32 }}>{g.note}</p>
      </Section>
      <PageCta title={d.landing.final.title} text={d.landing.final.text} cta={{ href: `${href(locale, "contact")}?topic=0`, label: d.landing.final.cta }} link={{ href: href(locale, "privacy"), label: d.ui.footer.privacy }} />
    </>
  );
}
