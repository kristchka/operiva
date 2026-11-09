"use client";

import { useEffect, useRef } from "react";
import { subscribe } from "@/lib/speech";
import { basePath, isStaticSite } from "@/lib/i18n";

/**
 * Портрет помощника AISI LAB, оживлённый в браузере:
 * дыхание, пульсирующее свечение, искры и движение губ в такт речи (lib/speech).
 * Координаты рта заданы долями от размера портрета (подобраны под aura-head.webp).
 */
const SRC = "/aura-head.webp";
const MOUTH = { cx: 0.4993, lip: 0.5636, w: 0.19, chinEnd: 0.69, maxDrop: 0.032 };

export function PortraitHead({ className, compact = false }: { className?: string; compact?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const img = new Image();
    img.src = (isStaticSite ? basePath : "") + SRC;

    // Портрет с мягко растворёнными краями (чёрный фон исходника сливается со сценой).
    const base = document.createElement("canvas");
    // Буфер для смещённой нижней части лица.
    const jaw = document.createElement("canvas");
    let ready = false;

    const prepare = () => {
      const iw = img.naturalWidth, ih = img.naturalHeight;
      base.width = iw; base.height = ih;
      const b = base.getContext("2d")!;
      b.drawImage(img, 0, 0);
      // Убираем тёмный фон исходника (по яркости) и растворяем края — без видимой рамки.
      const data = b.getImageData(0, 0, iw, ih);
      const d = data.data;
      const ss = (e0: number, e1: number, x: number) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
      for (let y = 0; y < ih; y++) {
        const fy = Math.min(y / ih, 1 - y / ih);
        const bottom = ss(1, 0.8, y / ih);
        for (let x = 0; x < iw; x++) {
          const k = (y * iw + x) * 4;
          const v = Math.max(d[k], d[k + 1], d[k + 2]);
          const key = ss(14, 70, v);
          const edge = ss(0, 0.14, Math.min(fy, x / iw, 1 - x / iw));
          d[k + 3] = Math.round(255 * key * edge * bottom);
        }
      }
      b.putImageData(data, 0, 0);
      ready = true;
    };

    let level = 0, mouth = 0, raf = 0, visible = true;
    const unsub = subscribe((s) => { level = s.level; });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    type Spark = { x: number; y: number; vy: number; vx: number; r: number; life: number; max: number };
    const sparks: Spark[] = [];

    const draw = (t: number) => {
      if (!ready) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.round(canvas.clientWidth * dpr), H = Math.round(canvas.clientHeight * dpr);
      if (!W || !H) return;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      ctx.clearRect(0, 0, W, H);

      const iw = base.width, ih = base.height;
      const breathe = reduce ? 0 : Math.sin(t / 1700);
      const s = Math.min(W / iw, H / ih) * (compact ? 1.55 : 1) * (1 + breathe * 0.005);
      const dw = iw * s, dh = ih * s;
      const ox = (W - dw) / 2;
      const oy = (compact ? (H - dh) / 2 + dh * 0.06 : (H - dh) / 2) + breathe * 2.5 * dpr;

      mouth += (level - mouth) * 0.45;

      // свечение за головой
      const glow = 0.22 + (reduce ? 0 : Math.sin(t / 1100) * 0.05) + mouth * 0.18;
      // радиус свечения не выходит за края холста — иначе виден срез
      const gcy = oy + dh * 0.42, gr = Math.min(W / 2, gcy, H - gcy, dh * 0.6) * 0.98;
      const g = ctx.createRadialGradient(W / 2, gcy, 0, W / 2, gcy, gr);
      g.addColorStop(0, `rgba(56,120,255,${glow})`);
      g.addColorStop(1, "rgba(56,120,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.drawImage(base, ox, oy, dw, dh);

      // губы: смещаем нижнюю губу и подбородок вниз, под ними — тень открытого рта
      if (mouth > 0.03) {
        const drop = MOUTH.maxDrop * ih * Math.min(1, mouth);
        const sx = (MOUTH.cx - MOUTH.w) * iw, sw = MOUTH.w * 2 * iw;
        const sy = MOUTH.lip * ih, sh = (MOUTH.chinEnd - MOUTH.lip) * ih;
        const mx = ox + MOUTH.cx * iw * s, my = oy + sy * s;

        // полость рта
        ctx.save();
        const cav = ctx.createRadialGradient(mx, my + drop * s * 0.5, 0, mx, my + drop * s * 0.5, MOUTH.w * iw * s * 0.45);
        cav.addColorStop(0, "rgba(4,8,30,0.95)");
        cav.addColorStop(0.7, "rgba(12,30,90,0.85)");
        cav.addColorStop(1, "rgba(30,70,170,0)");
        ctx.fillStyle = cav;
        ctx.beginPath();
        ctx.ellipse(mx, my + drop * s * 0.45, MOUTH.w * iw * s * 0.36, Math.max(1, drop * s * 0.75), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // нижняя часть лица, растянутая вниз с затуханием к подбородку и по краям
        const jw = Math.ceil(sw), jh = Math.ceil(sh + drop);
        if (jaw.width !== jw || jaw.height !== jh) { jaw.width = jw; jaw.height = jh; }
        const j = jaw.getContext("2d")!;
        j.clearRect(0, 0, jw, jh);
        const strips = 30;
        for (let i = 0; i < strips; i++) {
          const k = i / strips;
          const shift = drop * (1 - k) ** 1.3;
          const y0 = k * sh, h0 = sh / strips + 1;
          j.drawImage(base, sx, sy + y0, sw, h0, 0, y0 + shift, sw, h0);
        }
        j.globalCompositeOperation = "destination-in";
        const fx = j.createLinearGradient(0, 0, jw, 0);
        fx.addColorStop(0, "rgba(0,0,0,0)");
        fx.addColorStop(0.22, "rgba(0,0,0,1)");
        fx.addColorStop(0.78, "rgba(0,0,0,1)");
        fx.addColorStop(1, "rgba(0,0,0,0)");
        j.fillStyle = fx;
        j.fillRect(0, 0, jw, jh);
        j.globalCompositeOperation = "source-over";
        ctx.drawImage(jaw, ox + sx * s, oy + sy * s, jw * s, jh * s);
      }

      // искры, поднимающиеся от шеи
      if (!reduce && Math.random() < (compact ? 0.12 : 0.4)) {
        sparks.push({ x: W / 2 + (Math.random() - 0.5) * dw * 0.45, y: oy + dh * (0.82 + Math.random() * 0.14), vx: (Math.random() - 0.5) * 0.3, vy: -(0.25 + Math.random() * 0.7), r: 0.6 + Math.random() * 1.5, life: 0, max: 90 + Math.random() * 120 });
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life++; p.x += p.vx * dpr; p.y += p.vy * dpr;
        const a = Math.min(1, p.life / 18) * Math.max(0, 1 - p.life / p.max);
        if (p.life > p.max) { sparks.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(160,205,255,${a * 0.9})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2); ctx.fill();
      }
    };

    const loop = (t: number) => { raf = requestAnimationFrame(loop); if (visible) draw(t); };
    const start = () => { prepare(); draw(0); if (!reduce) raf = requestAnimationFrame(loop); };
    if (img.complete && img.naturalWidth) start(); else img.onload = start;

    // Для режима «уменьшить движение» всё равно двигаем губы при речи.
    let rr = 0;
    const reducedSpeech = () => { rr = requestAnimationFrame(reducedSpeech); if (reduce && (level > 0 || mouth > 0.03)) draw(performance.now()); };
    if (reduce) rr = requestAnimationFrame(reducedSpeech);

    const onResize = () => draw(performance.now());
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(rr); unsub(); io.disconnect(); window.removeEventListener("resize", onResize); };
  }, [compact]);

  return <canvas ref={ref} className={`portrait-head ${className ?? ""}`} aria-hidden />;
}
