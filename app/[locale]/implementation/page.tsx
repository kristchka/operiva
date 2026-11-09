import { getDict } from "@/content";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { PageHero, Section, PageCta } from "@/components/Section";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "method");
}

// «Внедрение и управление»: шаги внедрения и границы, в которых работает ИИ.
// Прежняя страница «Управление» (/governance) стала разделом #control этой страницы.
export default async function MethodPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const m = d.method;
  const g = d.gov;

  return (
    <>
      <PageHero {...m.hero} />
      <Section id="steps" title={m.stepsTitle} intro={m.stepsText}>
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
      <Section id="control" title={m.controlTitle} intro={m.controlText} alt>
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
