"use client";

import Link from "@/components/SmartLink";
import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/content";
import { basePath, href, isStaticSite, type Locale } from "@/lib/i18n";
import { localeToSpeechLang, speak, stop as stopSpeech } from "@/lib/speech";
import { PortraitHead } from "./PortraitHead";

type Msg = { from: "ai" | "guest"; text: string };
type Mode = "chat" | "leave" | "done";

const TOPICS: { key: keyof Dict["chat"]["answers"]; re: RegExp }[] = [
  { key: "nal", re: /\bnal\b|нал|памят|memory|mémoire|memoria|memória|gedächtnis|მეხსიერ/i },
  { key: "hotels", re: /hotel|отел|гост|tiflis|hôtel|hotéis|სასტუმრო/i },
  { key: "site", re: /сайт|site|web|sito|საიტ/i },
  { key: "products", re: /продукт|направлен|product|produit|produkt|prodotto|producto|produto|travel|путеш|security|безопас|პროდუქტ/i },
];

/** Открыть чат с любой страницы: window.dispatchEvent(new Event("aisi:open-chat")) */
export function Chat({ locale, c, deliveryEnabled }: { locale: Locale; c: Dict["chat"]; deliveryEnabled: boolean }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "ai", text: c.greeting }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [voice, setVoice] = useState(false);
  const say = (t: string) => { if (voice) speak(t, localeToSpeechLang(locale)); };
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("aisi:open-chat", onOpen);
    return () => window.removeEventListener("aisi:open-chat", onOpen);
  }, []);

  // При смене языка начинаем разговор заново на новом языке.
  useEffect(() => {
    setMsgs([{ from: "ai", text: c.greeting }]);
    setMode("chat");
  }, [c.greeting]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, mode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const topic = TOPICS.find((t) => t.re.test(q));
    const a = c.answers[topic?.key ?? "fallback"];
    setMsgs((m) => [...m, { from: "guest", text: q }, { from: "ai", text: a }]);
    say(a);
    setInput("");
  };

  const quick = (i: number) => {
    if (i === 3) {
      setMsgs((m) => [...m, { from: "guest", text: c.quick[3] }]);
      setMode("leave");
      return;
    }
    const keys = ["nal", "hotels", "site"] as const;
    setMsgs((m) => [...m, { from: "guest", text: c.quick[i] }, { from: "ai", text: c.answers[keys[i]] }]);
    say(c.answers[keys[i]]);
  };

  const submitLeave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (deliveryEnabled) {
      setSending(true);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ source: "chat", locale, name: fd.get("name"), contact: fd.get("contact"), task: fd.get("text") }),
        });
        if (!res.ok) throw new Error();
        setMode("done");
      } catch {
        setMode("leave");
      } finally {
        setSending(false);
      }
    } else {
      setMode("done");
    }
  };

  if (!open) {
    return (
      <button className="chat-fab" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <img className="dot" alt="" aria-hidden src={`${isStaticSite ? basePath : ""}/aura-avatar.webp`} width={42} height={42} />
        {c.open}
      </button>
    );
  }

  return (
    <div className="chat-panel" role="dialog" aria-label={c.title}>
      <div className="chat-top">
        <span className="chat-holo" aria-hidden><PortraitHead compact /></span>
        <b>{c.title}</b>
        {!deliveryEnabled && <span className="badge badge-demo">{c.demoBadge}</span>}
        <button
          type="button"
          className={`chat-voice${voice ? " on" : ""}`}
          aria-pressed={voice}
          aria-label="Voice"
          title="Voice"
          onClick={() => { if (voice) stopSpeech(); setVoice((v) => !v); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 10v4h4l5 4V6L8 10H4Z" />{voice && <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}</svg>
        </button>
        <button onClick={() => { stopSpeech(); setOpen(false); }} aria-label="×">×</button>
      </div>
      {!deliveryEnabled && <div className="chat-note">{c.demoNote}</div>}

      <div className="chat-body" ref={bodyRef} aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.from}`}>{m.text}</div>
        ))}

        {mode === "chat" && (
          <div className="chat-quick">
            {c.quick.map((q, i) => (
              <button key={q} onClick={() => quick(i)}>{q}</button>
            ))}
          </div>
        )}

        {mode === "leave" && (
          <form className="chat-leave" onSubmit={submitLeave}>
            <b>{c.leaveTitle}</b>
            <input name="name" placeholder={c.leaveName} aria-label={c.leaveName} required autoComplete="name" />
            <input name="contact" placeholder={c.leaveContact} aria-label={c.leaveContact} required />
            <textarea name="text" placeholder={c.leaveText} aria-label={c.leaveText} required />
            <button className="btn btn-primary" disabled={sending}>{c.leaveSubmit}</button>
          </form>
        )}

        {mode === "done" && (
          <div className="chat-confirm" role="status">
            {deliveryEnabled ? (
              c.confirmReal
            ) : (
              <>
                {c.confirmDemo}{" "}
                <Link href={href(locale, "contact")} onClick={() => setOpen(false)}>{c.toContact} →</Link>
              </>
            )}
          </div>
        )}
      </div>

      {mode === "chat" && (
        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={c.placeholder} aria-label={c.placeholder} />
          <button type="submit">{c.send}</button>
        </form>
      )}
    </div>
  );
}

export function OpenChatButton({ label, className = "btn" }: { label: string; className?: string }) {
  return (
    <button className={className} onClick={() => window.dispatchEvent(new Event("aisi:open-chat"))}>
      {label}
    </button>
  );
}
