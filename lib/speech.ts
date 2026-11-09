"use client";

/**
 * Озвучка ответов помощника через синтез речи браузера.
 * Сообщает подписчикам «уровень» речи (0..1) для анимации губ и позицию в тексте для субтитров.
 * Если браузер не умеет говорить — имитирует речь по таймеру, чтобы анимация и субтитры работали.
 */
type State = { speaking: boolean; level: number; char: number; text: string };
type Listener = (s: State) => void;

const listeners = new Set<Listener>();
let state: State = { speaking: false, level: 0, char: 0, text: "" };
let peak = 0;
let raf = 0;
let fakeTimer = 0;
let session = 0;

function emit(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l(state));
}

function loop() {
  if (!state.speaking) { emit({ level: 0 }); return; }
  peak *= 0.86;
  const noise = 0.25 + Math.random() * 0.45;
  emit({ level: Math.min(1, Math.max(peak, noise * (0.55 + peak))) });
  raf = requestAnimationFrame(loop);
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  fn(state);
  return () => { listeners.delete(fn); };
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

function pickVoice(lang: string) {
  const voices = window.speechSynthesis.getVoices();
  const base = lang.slice(0, 2);
  return voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(base)) || null;
}

export function stop() {
  session++;
  try { if (canSpeak()) window.speechSynthesis.cancel(); } catch {}
  window.clearInterval(fakeTimer);
  cancelAnimationFrame(raf);
  emit({ speaking: false, level: 0 });
}

/** Говорит текст. Возвращает true, если использован настоящий голос браузера. */
export function speak(text: string, lang: string): boolean {
  stop();
  const my = ++session;
  emit({ speaking: true, char: 0, text });
  raf = requestAnimationFrame(loop);

  const finish = () => { if (my === session) { cancelAnimationFrame(raf); emit({ speaking: false, level: 0, char: text.length }); } };
  const fake = () => {
    let i = 0;
    fakeTimer = window.setInterval(() => {
      if (my !== session) return window.clearInterval(fakeTimer);
      i += 2; peak = Math.random() > 0.5 ? 1 : peak;
      emit({ char: Math.min(i, text.length) });
      if (i >= text.length) { window.clearInterval(fakeTimer); finish(); }
    }, 55);
  };

  if (!canSpeak()) { fake(); return false; }
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.rate = 1.02;
    u.pitch = 1.05;
    let gotBoundary = false;
    u.onboundary = (e) => { gotBoundary = true; peak = 1; emit({ char: e.charIndex }); };
    u.onend = finish;
    u.onerror = () => { if (my === session) fake(); };
    window.speechSynthesis.speak(u);
    // Некоторые браузеры не присылают границы слов — двигаем субтитры сами.
    window.setTimeout(() => {
      if (my !== session || gotBoundary || !state.speaking) return;
      let i = 0;
      fakeTimer = window.setInterval(() => {
        if (my !== session || !state.speaking) return window.clearInterval(fakeTimer);
        i += 2; if (Math.random() > 0.6) peak = 1;
        emit({ char: Math.min(i, text.length) });
      }, 60);
    }, 600);
    return !!v || window.speechSynthesis.getVoices().length > 0;
  } catch {
    fake();
    return false;
  }
}

export function localeToSpeechLang(locale: string) {
  return ({ ru: "ru-RU", en: "en-US", de: "de-DE", es: "es-ES", it: "it-IT", fr: "fr-FR", ka: "ka-GE", pt: "pt-PT" } as Record<string, string>)[locale] ?? "en-US";
}
