import { getDict } from "@/content";
import { pageMeta, resolveLocale, type LocaleParams } from "@/lib/meta";
import { site } from "@/lib/site";
import { PageHero, Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata({ params }: LocaleParams) {
  return pageMeta(await resolveLocale(params), "contact");
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const d = getDict(locale);
  const c = d.contact;

  return (
    <>
      <PageHero {...c.hero} />
      <Section alt>
        <div className="contact-grid">
          <div>
            <dl className="rows">
              <div className="row"><dt>{d.company.legal.location}</dt><dd>{c.location}</dd></div>
              <div className="row">
                <dt>{c.emailLabel}</dt>
                <dd>{site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : <span className="muted">{c.emailPending}</span>}</dd>
              </div>
              <div className="row"><dt>{d.company.legal.entity}</dt><dd>{site.legalEntity}</dd></div>
            </dl>
          </div>
          <div className="card" style={{ padding: "clamp(20px, 4vw, 36px)" }}>
            <h2 style={{ fontSize: "1.6rem" }}>{d.form.title}</h2>
            <ContactForm locale={locale} f={d.form} />
          </div>
        </div>
      </Section>
    </>
  );
}
