"use client";

import { useEffect, useState } from "react";
import Link from "@/components/SmartLink";
import type { Dict } from "@/content";
import { href, isStaticSite, type Locale } from "@/lib/i18n";

type State = "idle" | "sending" | "ok" | "error" | "not-configured";
type Errors = Partial<Record<"name" | "contact" | "task", boolean>>;

export function ContactForm({ locale, f }: { locale: Locale; f: Dict["form"] }) {
  const [state, setState] = useState<State>("idle");
  const [defaultTopic, setDefaultTopic] = useState(0);

  // Тема из ссылки вида ?topic=2 — читаем в браузере, чтобы страница оставалась статической.
  useEffect(() => {
    const t = Number(new URLSearchParams(window.location.search).get("topic"));
    if (Number.isInteger(t) && t >= 0 && t < f.topics.length) setDefaultTopic(t);
  }, [f.topics.length]);
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      topic: String(fd.get("topic") ?? ""),
      name: String(fd.get("name") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      contact: String(fd.get("contact") ?? "").trim(),
      task: String(fd.get("task") ?? "").trim(),
      website: String(fd.get("website") ?? ""), // ловушка для ботов
      locale,
      source: "form",
    };
    const errs: Errors = { name: !data.name, contact: !data.contact, task: !data.task };
    setErrors(errs);
    if (errs.name || errs.contact || errs.task) {
      const first = (["name", "contact", "task"] as const).find((k) => errs[k]);
      if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    // В статической демо-версии сервера нет — честно сообщаем, что отправка не подключена.
    if (isStaticSite) return setState("not-configured");
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      // 503 — доставка не настроена; 404/405 — статическая версия сайта без сервера.
      if ([503, 404, 405].includes(res.status)) return setState("not-configured");
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "ok") {
    return (
      <div className="alert alert-ok" role="status">
        <b>{f.successTitle}</b>
        {f.successText}
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => setState("idle")}>{f.again}</button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 8 }}>{f.topicLabel}</legend>
        <div className="chips">
          {f.topics.map((t, i) => (
            <label key={t} className="chip">
              <input type="radio" name="topic" value={t} checked={i === defaultTopic} onChange={() => setDefaultTopic(i)} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field" data-invalid={!!errors.name}>
        <label htmlFor="cf-name">{f.name}</label>
        <input id="cf-name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "cf-name-err" : undefined} />
        {errors.name && <span id="cf-name-err" className="err">{f.required}</span>}
      </div>

      <div className="field">
        <label htmlFor="cf-company">{f.company} <small>({f.optional})</small></label>
        <input id="cf-company" name="company" autoComplete="organization" />
      </div>

      <div className="field" data-invalid={!!errors.contact}>
        <label htmlFor="cf-contact">{f.contact}</label>
        <input id="cf-contact" name="contact" aria-invalid={!!errors.contact} aria-describedby="cf-contact-hint" />
        <span id="cf-contact-hint" className="hint">{f.contactHint}</span>
        {errors.contact && <span className="err">{f.required}</span>}
      </div>

      <div className="field" data-invalid={!!errors.task}>
        <label htmlFor="cf-task">{f.task}</label>
        <textarea id="cf-task" name="task" aria-invalid={!!errors.task} aria-describedby="cf-task-hint" />
        <span id="cf-task-hint" className="hint">{f.taskHint}</span>
        {errors.task && <span className="err">{f.required}</span>}
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: -9999, width: 1, height: 1 }} />

      <p className="small muted" style={{ margin: 0 }}>
        <Link href={href(locale, "privacy")}>{f.consent}</Link>
      </p>

      {state === "error" && (
        <div className="alert alert-err" role="alert"><b>{f.errorTitle}</b>{f.errorText}</div>
      )}
      {state === "not-configured" && (
        <div className="alert alert-warn" role="alert"><b>{f.notConfiguredTitle}</b>{f.notConfiguredText}</div>
      )}

      <div>
        <button className="btn btn-primary" type="submit" disabled={state === "sending"}>
          {state === "sending" ? f.sending : f.submit}
        </button>
      </div>
    </form>
  );
}
