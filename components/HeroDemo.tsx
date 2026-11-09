"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/content";

const DELAYS = [700, 1100, 1300, 1400, 1300, 1200, 4800]; // мс до следующего шага
const LAST = DELAYS.length - 1;

/** Демонстрационный интерфейс AISI LAB для отелей. Данные вымышлены и помечены. */
export function HeroDemo({ m, demoLabel }: { m: Dict["mock"]; demoLabel: string }) {
  const [step, setStep] = useState(LAST);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setStep(0);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setStep((s) => (s >= LAST ? 0 : s + 1)), DELAYS[step]);
    return () => clearTimeout(t);
  }, [step]);

  const [first, ...rest] = m.requests;
  const reqs = step >= 4 ? [first, ...rest] : rest;

  return (
    <div className="mock-stage fade-in-3">
      <div className="mock-label"><span className="badge badge-demo" title={demoLabel}>{m.label}</span></div>
      <div className="mock" aria-label={m.label}>
        <div className="mock-bar"><i /><i /><i /><b>{m.app}</b></div>
        <div className="mock-body">
          <div className="mock-side" aria-hidden>
            {m.nav.map((n, i) => <span key={n} className={i === 0 ? "on" : undefined}>{n}</span>)}
          </div>

          <div className="mock-main">
            <h4>{m.hello}</h4>
            <div className="mock-stats">
              {m.stats.map(([k, v]) => (
                <div key={k} className="mock-stat"><small>{k}</small><b>{v}</b></div>
              ))}
            </div>
            <h4 style={{ marginTop: 6 }}>{m.requestsTitle}</h4>
            <div className="mock-req">
              {reqs.map(([title, who, kind, label], i) => (
                <div key={title} className={`req${step >= 4 && i === 0 ? " flash" : ""}`}>
                  <span>{title}</span>
                  <em className={kind}>{label}</em>
                  <small>{who}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="mock-chat">
            <div className="mock-chat-head"><span className="avatar">AI</span>{m.chatTitle}</div>
            {step >= 1 && <div className="bubble guest">{m.chat[0][1]}</div>}
            {(step === 2 || step === 5) && <div className="typing" aria-label={m.typing}><i /><i /><i /></div>}
            {step >= 3 && <div className="bubble ai">{m.chat[1][1]}</div>}
            {step >= 4 && <div className="bubble system">{m.created}: {first[0]}</div>}
            {step >= 6 && <div className="bubble ai">{m.chat[2][1]}</div>}
            <div className="mem">
              <b>{m.memoryTitle}</b>
              <ul>{m.memory.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
