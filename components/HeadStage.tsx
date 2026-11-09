"use client";

import { useEffect, useState } from "react";
import type { Play } from "@/content/play.ru";
import { canSpeak, localeToSpeechLang, speak, stop, subscribe } from "@/lib/speech";
import { PortraitHead } from "./PortraitHead";

/** Сцена с говорящей головой: вопросы, голос и субтитры. */
export function HeadStage({ h, locale }: { h: Play["head"]; locale: string }) {
  const [active, setActive] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [char, setChar] = useState(0);
  const [voice, setVoice] = useState(true);

  useEffect(() => {
    setVoice(canSpeak());
    const un = subscribe((s) => { setSpeaking(s.speaking); setChar(s.char); });
    return () => { un(); stop(); };
  }, []);

  const ask = (i: number) => {
    setActive(i);
    speak(h.questions[i][1], localeToSpeechLang(locale));
  };

  const text = active !== null ? h.questions[active][1] : "";
  const shownTo = speaking ? Math.max(char, 1) : text.length;
  // Показываем субтитры до конца текущего слова.
  const cut = text.indexOf(" ", shownTo);
  const done = cut === -1 ? text : text.slice(0, cut);

  return (
    <div className="head-stage">
      <div className="head-visual">
        <div className="head-halo" />
        <PortraitHead />
        <div className={`head-wave${speaking ? " on" : ""}`} aria-hidden>{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 6) * 0.08}s` }} />)}</div>
      </div>
      <div className="head-side">
        <p className="eyebrow eyebrow-dark">{h.eyebrow}</p>
        <h2>{h.title}</h2>
        <p className="head-lead">{h.lead}</p>
        <div className="head-qs">
          {h.questions.map(([q], i) => (
            <button key={q} type="button" className={active === i ? "on" : undefined} onClick={() => ask(i)}>
              {q}
            </button>
          ))}
        </div>
        <div className="head-caption" aria-live="polite">
          {active === null ? (
            <span className="muted-dark">…</span>
          ) : (
            <>
              <span>{done}</span>
              <span className="ghost">{text.slice(done.length)}</span>
            </>
          )}
        </div>
        <div className="head-foot">
          {speaking && <button type="button" className="head-stop" onClick={stop}>■ {h.stop}</button>}
          <span>{voice ? h.note : h.noVoice}</span>
        </div>
      </div>
    </div>
  );
}
