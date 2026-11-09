"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Play } from "@/content/play.ru";
import { localeToSpeechLang, speak } from "@/lib/speech";
import { Icon, type IconName } from "./Icon";

function LogLine({ s }: { s: string }) {
  const [t, ...rest] = s.split("|");
  return rest.length ? <><span className="log-t">{t}</span>{rest.join("|")}</> : <>{s}</>;
}

export type DemoKey = "hotel" | "translator" | "travel" | "security" | "memory";
const ICONS: Record<DemoKey, IconName> = { hotel: "bed", translator: "globe", travel: "route", security: "shield", memory: "layers" };
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Живые демонстрации продуктов. Всё работает в браузере, ничего не отправляется. */
export function Playground({ p, locale, tabs = ["hotel", "translator", "travel", "security", "memory"] }: { p: Play["play"]; locale: string; tabs?: DemoKey[] }) {
  const [tab, setTab] = useState<DemoKey>(tabs[0]);
  return (
    <div className="pg">
      {tabs.length > 1 && (
        <div className="pg-tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : undefined} onClick={() => setTab(t)}>
              <Icon name={ICONS[t]} size={16} /> {p.tabs[t]}
            </button>
          ))}
        </div>
      )}
      <div className="pg-window">
        <div className="pg-bar">
          <span className="dots"><i /><i /><i /></span>
          <b>AISI LAB <span className="pg-bar-sub">{p.tabs[tab]}</span></b>
          <span className="badge badge-demo">{p.demo}</span>
        </div>
        <div className="pg-body" key={tab}>
          {tab === "hotel" && <HotelDemo d={p.hotel} />}
          {tab === "translator" && <TranslatorDemo d={p.translator} />}
          {tab === "travel" && <TravelDemo d={p.travel} />}
          {tab === "security" && <SecurityDemo d={p.security} />}
          {tab === "memory" && <MemoryDemo d={p.memory} locale={locale} />}
        </div>
      </div>
    </div>
  );
}

/* ================= Отель ================= */
type Req = { id: number; title: string; dept: string; human: boolean; col: 0 | 1 | 2; done: string; at: string };
function HotelDemo({ d }: { d: Play["play"]["hotel"] }) {
  const [msgs, setMsgs] = useState<{ who: "guest" | "ai" | "sys"; text: string }[]>([]);
  const [reqs, setReqs] = useState<Req[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, typing]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setMsgs((m) => [...m, { who: "guest", text: q }]);
    setInput("");
    setTyping(true);
    const low = q.toLowerCase();
    let idx = d.prompts.findIndex((x) => x.q === q);
    if (idx < 0) idx = d.keywords.findIndex((ks) => ks.some((k) => low.includes(k)));
    const pr = idx >= 0 ? d.prompts[idx] : null;
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { who: "ai", text: pr ? pr.a : d.fallback }]);
      const req = pr ? pr.req : d.fallbackReq;
      if (req) {
        const id = idRef.current++;
        setReqs((r) => [{ id, title: req[0], dept: req[1], human: pr ? pr.human : true, col: 0, done: pr?.done ?? "", at: now() }, ...r]);
        setLog((l) => [`${now()}|${d.events.created}: ${req[0]}`, ...l].slice(0, 5));
        setFlash(id);
        window.setTimeout(() => setFlash(null), 1400);
      }
    }, 900);
  };

  const move = (id: number) => {
    const x = reqs.find((r) => r.id === id);
    if (!x) return;
    const col = Math.min(2, x.col + 1) as 0 | 1 | 2;
    setReqs((r) => r.map((y) => (y.id === id ? { ...y, col } : y)));
    setLog((l) => [`${now()}|${col === 1 ? d.events.taken : d.events.done}: ${x.title}`, ...l].slice(0, 5));
    if (col === 2 && x.done) setMsgs((m) => [...m, { who: "sys", text: `✓ ${x.done}` }]);
  };

  const open = reqs.filter((r) => r.col < 2).length;
  const human = reqs.filter((r) => r.col < 2 && r.human).length;
  const done = reqs.filter((r) => r.col === 2).length;

  return (
    <div className="hd">
      <section className="hd-chat">
        <header><span className="avatar">AI</span><b>{d.guest}</b></header>
        <div className="hd-msgs" ref={chatRef}>
          {msgs.length === 0 && <p className="pg-hint">{d.hint}</p>}
          {msgs.map((m, i) => <div key={i} className={`bubble ${m.who === "sys" ? "system" : m.who}`}>{m.text}</div>)}
          {typing && <div className="typing"><i /><i /><i /></div>}
        </div>
        <div className="hd-prompts">
          {d.prompts.map((x) => <button key={x.q} type="button" onClick={() => send(x.q)} disabled={typing}>{x.q}</button>)}
        </div>
        <form className="hd-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={d.placeholder} aria-label={d.placeholder} />
          <button type="submit" aria-label={d.send}><Icon name="send" size={16} /></button>
        </form>
      </section>

      <section className="hd-board">
        <header><b>{d.staff}</b></header>
        <div className="hd-cols">
          {d.cols.map((c, ci) => (
            <div key={c} className="hd-col">
              <h5>{c} <span>{reqs.filter((r) => r.col === ci).length}</span></h5>
              {reqs.filter((r) => r.col === ci).map((r) => (
                <div key={r.id} className={`hd-card${flash === r.id ? " flash" : ""}${r.col === 2 ? " done" : ""}`}>
                  <b>{r.title}</b>
                  <small>{r.dept}<span className="hd-at">{r.at}</span></small>
                  {r.human && r.col < 2 && <em>{d.humanTag}</em>}
                  {r.col < 2 && <button type="button" onClick={() => move(r.id)}>{r.col === 0 ? d.take : d.finish} →</button>}
                </div>
              ))}
              {reqs.filter((r) => r.col === ci).length === 0 && <p className="hd-empty">{d.empty}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="hd-mgr">
        <header><b>{d.manager}</b></header>
        <div className="hd-stats">
          {[open, human, done].map((v, i) => (
            <div key={i} className={i === 1 && v > 0 ? "warn" : undefined}><b>{v}</b><small>{d.stats[i]}</small></div>
          ))}
        </div>
        <h5>{d.log}</h5>
        <ul className="hd-log">{log.length ? log.map((l, i) => <li key={i}><LogLine s={l} /></li>) : <li className="hd-empty">{d.empty}</li>}</ul>
      </section>
    </div>
  );
}

/* ================= Переводчик ================= */
const PHRASES: Record<string, string[]> = {
  ru: ["Где находится ближайшая станция метро?", "Можно счёт, пожалуйста?", "Я забронировал номер на имя Анна.", "Сколько стоит дорога до аэропорта?", "А обратно?"],
  en: ["Where is the nearest metro station?", "Could I have the bill, please?", "I booked a room under the name Anna.", "How much is it to get to the airport?", "And the way back?"],
  de: ["Wo ist die nächste U-Bahn-Station?", "Kann ich bitte die Rechnung haben?", "Ich habe ein Zimmer auf den Namen Anna gebucht.", "Was kostet die Fahrt zum Flughafen?", "Und die Rückfahrt?"],
  es: ["¿Dónde está la estación de metro más cercana?", "¿Me trae la cuenta, por favor?", "Reservé una habitación a nombre de Anna.", "¿Cuánto cuesta llegar al aeropuerto?", "¿Y la vuelta?"],
  ka: ["სად არის უახლოესი მეტროს სადგური?", "ანგარიში მომიტანეთ, თუ შეიძლება.", "ნომერი ანას სახელზე დავჯავშნე.", "რა ღირს აეროპორტამდე მისვლა?", "უკან დაბრუნება კი?"],
};
// Перевод последней фразы с учётом контекста (речь о дороге до аэропорта).
const CONTEXT_TARGET: Record<string, string> = {
  ru: "А сколько стоит обратная дорога из аэропорта?",
  en: "And how much is the trip back from the airport?",
  de: "Und was kostet die Rückfahrt vom Flughafen?",
  es: "¿Y cuánto cuesta el viaje de vuelta desde el aeropuerto?",
  ka: "აეროპორტიდან უკან დაბრუნება კი რა ღირს?",
};
const SPEECH: Record<string, string> = { ru: "ru-RU", en: "en-US", de: "de-DE", es: "es-ES", ka: "ka-GE" };

function TranslatorDemo({ d }: { d: Play["play"]["translator"] }) {
  const langs = Object.keys(d.langs) as (keyof typeof d.langs)[];
  const [from, setFrom] = useState<string>("ru");
  const [to, setTo] = useState<string>("en");
  const [sel, setSel] = useState<number | null>(null);
  const [stage, setStage] = useState<"idle" | "listen" | "type" | "done">("idle");
  const [typed, setTyped] = useState("");
  const [history, setHistory] = useState<number[]>([]);

  const target = sel === null ? "" : sel === 4 && history.includes(3) ? CONTEXT_TARGET[to] : PHRASES[to][sel];

  useEffect(() => {
    if (stage !== "type") return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1; setTyped(target.slice(0, i));
      if (i >= target.length) { window.clearInterval(id); setStage("done"); }
    }, 22);
    return () => window.clearInterval(id);
  }, [stage, target]);

  const pick = (i: number) => {
    setSel(i); setTyped(""); setStage("listen");
    window.setTimeout(() => setStage("type"), 1100);
    setHistory((h) => [...h, i]);
  };
  const swap = () => { setFrom(to); setTo(from); setSel(null); setStage("idle"); };

  return (
    <div className="tr">
      <div className="tr-langs">
        <label>{d.from}<select value={from} onChange={(e) => { setFrom(e.target.value); setSel(null); setStage("idle"); }}>{langs.map((l) => <option key={l} value={l} disabled={l === to}>{d.langs[l]}</option>)}</select></label>
        <button type="button" className="tr-swap" onClick={swap} aria-label="⇄">⇄</button>
        <label>{d.to}<select value={to} onChange={(e) => { setTo(e.target.value); setStage("idle"); setSel(null); }}>{langs.map((l) => <option key={l} value={l} disabled={l === from}>{d.langs[l]}</option>)}</select></label>
      </div>
      <div className="tr-grid">
        <div className="tr-phrases">
          <p className="pg-hint">{d.pick}</p>
          {PHRASES[from].map((ph, i) => (
            <button key={ph} type="button" className={sel === i ? "on" : undefined} onClick={() => pick(i)} lang={from}>
              <Icon name="mic" size={15} /> {ph}
            </button>
          ))}
        </div>
        <div className="tr-out">
          <div className={`tr-wave${stage === "listen" ? " on" : ""}`} aria-hidden>{Array.from({ length: 32 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 8) * 0.07}s` }} />)}</div>
          {stage === "listen" && <p className="tr-status">{d.listening}</p>}
          {sel !== null && stage !== "listen" && (
            <>
              <p className="tr-src" lang={from}>{PHRASES[from][sel]}</p>
              <p className="tr-dst" lang={to}>{typed}<span className={stage === "type" ? "caret" : "caret off"} /></p>
              {stage === "done" && sel === 4 && history.includes(3) && <p className="tr-ctx"><Icon name="spark" size={14} /> {d.context}</p>}
              {stage === "done" && <button type="button" className="btn" onClick={() => speak(target, SPEECH[to])}><Icon name="mic" size={16} /> {d.speak}</button>}
            </>
          )}
        </div>
      </div>
      <p className="pg-note">{d.note}</p>
    </div>
  );
}

/* ================= Путешествия ================= */
function TravelDemo({ d }: { d: Play["play"]["travel"] }) {
  const [budget, setBudget] = useState(1);
  const [days, setDays] = useState(2);
  const [ints, setInts] = useState<number[]>([0, 1]);
  const [booked, setBooked] = useState(false);
  const [sight, setSight] = useState<number | null>(null);

  const plan = useMemo(() => {
    if (!ints.length) return [];
    const pools = ints.map((i) => [...d.pools[i]]);
    const out: string[][] = [];
    let k = 0;
    for (let day = 0; day < days; day++) {
      const row: string[] = [];
      for (let s = 0; s < 3; s++) { const pool = pools[k % pools.length]; row.push(pool.length ? pool.shift()! : d.pools[ints[k % ints.length]][s]); k++; }
      out.push(row);
    }
    return out;
  }, [ints, days, d.pools]);

  const toggle = (i: number) => setInts((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]));

  return (
    <div className="tv">
      <aside className="tv-form">
        <label className="tv-field">{d.budget}
          <div className="seg">{d.budgets.map((b, i) => <button key={b} type="button" className={budget === i ? "on" : undefined} onClick={() => { setBudget(i); setBooked(false); }}>{b}</button>)}</div>
        </label>
        <label className="tv-field">{d.days}: <b>{days}</b>
          <input type="range" min={1} max={4} value={days} onChange={(e) => { setDays(Number(e.target.value)); setBooked(false); }} />
        </label>
        <div className="tv-field">{d.interests}
          <div className="chips-row">{d.interestNames.map((n, i) => <button key={n} type="button" className={ints.includes(i) ? "on" : undefined} onClick={() => { toggle(i); setBooked(false); }}>{n}</button>)}</div>
        </div>
        <div className="tv-field">{d.photo}
          <div className="tv-photos">
            {d.sights.map(([name], i) => (
              <button key={name} type="button" className={`tv-photo p${i}${sight === i ? " on" : ""}`} onClick={() => setSight(i)} aria-label={name}>
                <span className="scan" />
              </button>
            ))}
          </div>
          {sight !== null && <div className="tv-sight"><b>{d.sights[sight][0]}</b><p>{d.sights[sight][1]}</p></div>}
        </div>
      </aside>
      <div className="tv-plan">
        {plan.length === 0 ? <p className="pg-hint">{d.empty}</p> : (
          <>
            <ol className="tv-days">
              {plan.map((row, i) => (
                <li key={i}>
                  <span className="tv-day">{d.day} {i + 1}</span>
                  <ul>{row.map((x, s) => <li key={s}><small>{d.slots[s]}</small>{x}</li>)}</ul>
                </li>
              ))}
            </ol>
            <div className="tv-stay">
              <div><small>{d.stay}</small><b>{d.hotels[budget]}</b></div>
              <button type="button" className="btn btn-primary" onClick={() => setBooked(true)}>{d.book}</button>
            </div>
            {booked && <p className="tv-booked">{d.booked}</p>}
          </>
        )}
      </div>
    </div>
  );
}

/* ================= Безопасность ================= */
function SecurityDemo({ d }: { d: Play["play"]["security"] }) {
  const [mode, setMode] = useState(0);
  const [locks, setLocks] = useState([true, true]);
  const [alert, setAlert] = useState<null | { kind: "courier" | "night" | "guest"; text: string }>(null);
  const [visitors, setVisitors] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [hot, setHot] = useState<number | null>(null);
  const ev = (t: string) => setEvents((e) => [`${now()}|${t}`, ...e].slice(0, 6));

  const toggleLock = (i: number) => {
    setLocks((l) => l.map((v, k) => (k === i ? !v : v)));
    ev(`${d.lockNames[i]}: ${locks[i] ? d.unlockedEvt : d.lockedEvt}`);
  };
  const sim = (i: number) => {
    if (i === 0) { setAlert({ kind: "courier", text: d.courier }); setHot(0); ev(d.sims[0]); setVisitors((v) => [`${now()}|${d.sims[0]}`, ...v]); }
    if (i === 1) { setAlert({ kind: "night", text: d.night }); setHot(1); ev(d.sims[1]); }
    if (i === 2) { setAlert({ kind: "guest", text: d.guest }); setHot(0); setLocks((l) => [l[0], false]); ev(`${d.lockNames[1]}: ${d.unlockedEvt}`); setVisitors((v) => [`${now()}|${d.sims[2]}`, ...v]); }
  };

  return (
    <div className="sc">
      <div className="sc-plan">
        <svg viewBox="0 0 420 260" role="img" aria-label={d.rooms.join(", ")}>
          <defs>
            <linearGradient id="cone" x1="0" x2="1"><stop offset="0" stopColor="#93c5fd" stopOpacity=".45" /><stop offset="1" stopColor="#93c5fd" stopOpacity="0" /></linearGradient>
            <linearGradient id="coneHot" x1="0" x2="1"><stop offset="0" stopColor="#f87171" stopOpacity=".6" /><stop offset="1" stopColor="#f87171" stopOpacity="0" /></linearGradient>
            <pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" fill="none" stroke="#1b2850" strokeWidth=".6" /></pattern>
          </defs>
          <rect x="6" y="6" width="408" height="248" rx="16" className="sc-yard" />
          <rect x="6" y="6" width="408" height="248" rx="16" fill="url(#grid)" />
          <rect x="34" y="34" width="256" height="190" rx="10" className="sc-house" />
          <path d="M162 34V224M34 128H162M162 138H290" className="sc-wall" />
          <text x="98" y="84">{d.rooms[1]}</text><text x="98" y="180">{d.rooms[2]}</text>
          <text x="226" y="90">{d.rooms[3]}</text><text x="226" y="186">{d.rooms[0]}</text>
          <text x="356" y="232">{d.rooms[4]}</text>
          {/* камеры */}
          <g className={`sc-cam${hot === 0 ? " hot" : ""}`}>
            <path d="M296 170 L360 146 L360 196 Z" fill={hot === 0 ? "url(#coneHot)" : "url(#cone)"} />
            <circle cx="296" cy="170" r="5" /><circle cx="296" cy="170" r="9" className="ring" />
          </g>
          <g className={`sc-cam${hot === 1 ? " hot" : ""}`}>
            <path d="M392 26 L330 62 L370 88 Z" fill={hot === 1 ? "url(#coneHot)" : "url(#cone)"} />
            <circle cx="392" cy="26" r="5" /><circle cx="392" cy="26" r="9" className="ring" />
          </g>
          {hot === 1 && <g className="sc-motion"><circle cx="352" cy="74" r="5" /><circle cx="352" cy="74" r="5" className="wave" /></g>}
          {/* двери */}
          {[{ x: 290, y: 184, i: 0 }, { x: 402, y: 196, i: 1 }].map(({ x, y, i }) => (
            <g key={i} className={`sc-door${locks[i] ? "" : " open"}`} transform={`translate(${x} ${y})`}>
              <rect x="-4" y="-16" width="8" height="32" rx="4" />
              <circle cx="0" cy="0" r="8" className="badge-c" />
              <path d={locks[i] ? "M-3 -1h6v5h-6zM-2 -1v-2a2 2 0 0 1 4 0v2" : "M-3 -1h6v5h-6zM-2 -1v-2a2 2 0 0 1 4 -1"} className="lk" />
            </g>
          ))}
        </svg>
        <div className={`sc-status${alert ? (alert.kind === "night" ? " danger" : " info") : ""}`}>
          {alert ? alert.text : d.calm}
          {alert?.kind === "courier" && (
            <span className="sc-actions">
              <button type="button" onClick={() => { setLocks((l) => [l[0], false]); ev(`${d.lockNames[1]}: ${d.unlockedEvt}`); setAlert(null); setHot(null); }}>{d.open}</button>
              <button type="button" onClick={() => { setAlert(null); setHot(null); }}>{d.decline}</button>
            </span>
          )}
          {alert && alert.kind !== "courier" && <button type="button" className="sc-x" onClick={() => { setAlert(null); setHot(null); }}>×</button>}
        </div>
      </div>
      <aside className="sc-panel">
        <div className="sc-block">
          <h5>{d.mode}</h5>
          <div className="seg">{d.modes.map((m, i) => <button key={m} type="button" className={mode === i ? "on" : undefined} onClick={() => { setMode(i); ev(`${d.modeEvt}: ${m}`); }}>{m}</button>)}</div>
        </div>
        <div className="sc-block">
          <h5>{d.locks}</h5>
          {d.lockNames.map((n, i) => (
            <button key={n} type="button" className={`sc-lock${locks[i] ? "" : " open"}`} onClick={() => toggleLock(i)}>
              <Icon name="lock" size={16} /> {n} <span>{locks[i] ? d.locked : d.unlocked}</span>
            </button>
          ))}
        </div>
        <div className="sc-block">
          <h5>{d.simulate}</h5>
          <div className="sc-sims">{d.sims.map((s, i) => <button key={s} type="button" onClick={() => sim(i)}>{s}</button>)}</div>
        </div>
        <div className="sc-block">
          <h5>{d.alerts}</h5>
          <ul className="hd-log">{events.length ? events.map((e, i) => <li key={i}><LogLine s={e} /></li>) : <li className="hd-empty">{d.calm}</li>}</ul>
        </div>
        {visitors.length > 0 && <div className="sc-block"><h5>{d.visitors}</h5><ul className="hd-log">{visitors.map((v, i) => <li key={i}><LogLine s={v} /></li>)}</ul></div>}
      </aside>
      <p className="pg-note">{d.note}</p>
    </div>
  );
}

/* ================= Память НАЛ ================= */
function MemoryDemo({ d, locale }: { d: Play["play"]["memory"]; locale: string }) {
  const [short, setShort] = useState<string[]>([]);
  const [long, setLong] = useState<string[]>([]);
  const [answer, setAnswer] = useState<{ text: string; used: string[] } | null>(null);
  const [forgot, setForgot] = useState(false);
  const known = [...short, ...long];

  const tell = (id: string) => {
    if (known.includes(id)) return;
    setForgot(false);
    setShort((s) => [...s, id]);
    window.setTimeout(() => { setShort((s) => s.filter((x) => x !== id)); setLong((l) => (l.includes(id) ? l : [...l, id])); }, 1800);
  };
  const ask = (qi: number) => {
    const map = d.answers[qi];
    const used = Object.keys(map).filter((k) => k !== "base" && known.includes(k));
    const text = [map.base, ...used.map((k) => map[k])].join(" ") + (used.length ? "" : ` ${d.generic}`);
    setAnswer({ text, used });
    speak(text, localeToSpeechLang(locale));
  };
  const label = (id: string) => d.facts.find((f) => f[0] === id)?.[1] ?? id;

  return (
    <div className="mm">
      <div className="mm-col">
        <h5>{d.tell}</h5>
        <div className="mm-facts">
          {d.facts.map(([id, t]) => <button key={id} type="button" disabled={known.includes(id)} onClick={() => tell(id)}>+ {t}</button>)}
        </div>
        <h5 style={{ marginTop: 18 }}>{d.ask}</h5>
        <div className="mm-facts">{d.questions.map((q, i) => <button key={q} type="button" className="q" onClick={() => ask(i)}>{q}</button>)}</div>
      </div>
      <div className="mm-store">
        <div className="mm-layer short">
          <h5><i />{d.short}</h5>
          {short.length ? short.map((id) => <span key={id} className="mm-chip in">{label(id)}</span>) : <p className="hd-empty">{d.emptyShort}</p>}
        </div>
        <div className="mm-layer long">
          <h5><i />{d.long}</h5>
          {long.length ? long.map((id) => <span key={id} className={`mm-chip${answer?.used.includes(id) ? " used" : ""}`}>{label(id)}</span>) : <p className="hd-empty">{d.emptyLong}</p>}
        </div>
        {answer && (
          <div className="mm-answer">
            <span className="avatar">AI</span>
            <div>
              <p>{answer.text}</p>
              {answer.used.length > 0 && <small>{d.usedLabel}: {answer.used.map(label).join(", ")}</small>}
            </div>
          </div>
        )}
        {forgot && <p className="mm-forgot">{d.forgotten}</p>}
        {(long.length > 0 || short.length > 0) && (
          <button type="button" className="btn btn-ghost mm-forget" onClick={() => { setShort([]); setLong([]); setAnswer(null); setForgot(true); }}>{d.forget}</button>
        )}
      </div>
    </div>
  );
}
