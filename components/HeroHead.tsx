"use client";

import { useEffect, useState } from "react";
import type { Play } from "@/content/play.ru";
import { localeToSpeechLang, speak, stop, subscribe } from "@/lib/speech";
import { PortraitHead } from "./PortraitHead";

/** Говорящая голова на первом экране: три вопроса, голос и субтитры. */
export function HeroHead({ h, label, locale }: { h: Play["head"]; label: string; locale: string }) {
  const [active, setActive] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [char, setChar] = useState(0);

  useEffect(() => {
    const un = subscribe((s) => { setSpeaking(s.speaking); setChar(s.char); });
    return () => { un(); stop(); };
  }, []);

  const qs = h.questions.slice(0, 3);
  const text = active !== null ? qs[active][1] : "";
  const shownTo = speaking ? Math.max(char, 1) : text.length;
  const cut = text.indexOf(" ", shownTo);
  const done = cut === -1 ? text : text.slice(0, cut);

  return (
    <div className="hh">
      <PortraitHead />
      <div className="hh-panel">
        <div className="hh-label"><i aria-hidden />{label}</div>
        <div className="hh-qs">
          {qs.map(([q], i) => (
            <button
              key={q}
              type="button"
              className={active === i ? "on" : undefined}
              onClick={() => { setActive(i); speak(qs[i][1], localeToSpeechLang(locale)); }}
            >
              {q}
            </button>
          ))}
        </div>
        {active !== null && (
          <p className="hh-caption" aria-live="polite">
            {done}<span className="ghost">{text.slice(done.length)}</span>
          </p>
        )}
      </div>
    </div>
  );
}
