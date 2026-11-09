import Link from "@/components/SmartLink";
import { getDict } from "@/content";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { PageHero, Section, List, PageCta } from "@/components/Section";
import { Icon, type IconName } from "@/components/Icon";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "workforce");
}

export default async function WorkforcePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const w = d.workforce;

  return (
    <>
      <PageHero {...w.hero} />
      <Section title={w.rolesTitle} alt>
        <div className="roles-grid">
          {w.roles.map((r, i) => (
            <article key={r.name} className="role2">
              <header>
                <span className="role2-icon"><Icon name={(["send", "chat", "bed", "spark", "doc", "flow", "grid"] as IconName[])[i % 7]} size={20} /></span>
                <h3>{r.name}</h3>
                <span className="role2-n">{String(i + 1).padStart(2, "0")}</span>
              </header>
              <p className="role2-tasks">{r.tasks}</p>
              <div className="role2-sys">
                {r.systems.replace(/\.$/, "").split(/,\s*/).map((x) => <span key={x}>{x.charAt(0).toUpperCase() + x.slice(1)}</span>)}
              </div>
              <div className="role2-result">
                <Icon name="check" size={16} />
                <p><small>{w.labels.result}</small>{r.result}</p>
              </div>
              <footer className="role2-limit">
                <Icon name="shield" size={15} />
                <p><small>{w.labels.limits}</small>{r.limits}</p>
              </footer>
            </article>
          ))}
        </div>
        <p className="note" style={{ marginTop: 28 }}>{w.systemsNote}</p>
      </Section>

      <Section title={w.context.title} intro={w.context.text}>
        <div className="flow" aria-hidden>
          {w.context.flow.map((f, i) => (
            <span key={f} style={{ display: "contents" }}>
              <span>{f}</span>
              {i < w.context.flow.length - 1 && <i>→</i>}
            </span>
          ))}
        </div>
      </Section>

      <Section title={w.human.title} alt>
        <div style={{ maxWidth: 760 }}><List items={w.human.items} /></div>
        <div style={{ marginTop: 24 }}><Link className="arrow-link" href={href(locale, "gov")}>{d.ui.nav.gov} →</Link></div>
      </Section>

      <PageCta title={w.start.title} text={w.start.text} cta={{ href: `${href(locale, "contact")}?topic=0`, label: d.landing.final.cta }} link={{ href: href(locale, "method"), label: w.start.link }} />
    </>
  );
}
