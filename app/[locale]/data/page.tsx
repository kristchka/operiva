import { getDict } from "@/content";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { PageHero, Section } from "@/components/Section";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "privacy");
}

export default async function PrivacyPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const p = d.privacy;

  return (
    <>
      <PageHero {...p.hero} />
      <Section alt>
        <dl className="rows" style={{ maxWidth: 900 }}>
          {p.sections.map(([k, v]) => (
            <div key={k} className="row"><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </Section>
    </>
  );
}
