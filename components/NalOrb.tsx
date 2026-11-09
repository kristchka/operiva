"use client";

import { useEffect, useRef } from "react";

/**
 * НАЛ: ядро и три слоя памяти из частиц.
 * Кратковременная — быстрый внутренний слой, долгосрочная — медленные орбиты,
 * ассоциативная — узлы со связями. Частицы-«воспоминания» летят снаружи к ядру.
 */
export function NalOrb({ labels, center }: { labels: string[]; center: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      const el = host.current;
      if (!el || disposed) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0, 5.2);
      const root = new THREE.Group();
      scene.add(root);
      const pr = renderer.getPixelRatio();

      const pointsMat = (size: number) => new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uSize: { value: size * pr }, uTime: { value: 0 } },
        vertexShader: `
          attribute vec3 color; attribute float aRnd; uniform float uSize, uTime;
          varying vec3 vC; varying float vA;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            gl_Position = projectionMatrix * mv;
            vC = color; vA = 0.55 + 0.45 * sin(uTime * 2.0 + aRnd * 30.0);
            gl_PointSize = uSize * (5.0 / -mv.z) * (0.7 + aRnd * 0.6);
          }`,
        fragmentShader: `
          varying vec3 vC; varying float vA;
          void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
            gl_FragColor = vec4(vC, smoothstep(0.5, 0.0, d) * vA); }`,
      });
      const layer = (count: number, fn: (i: number) => [number, number, number], col: [number, number, number], size: number) => {
        const p: number[] = [], c: number[] = [], r: number[] = [];
        for (let i = 0; i < count; i++) { p.push(...fn(i)); c.push(...col); r.push(Math.random()); }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
        g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));
        g.setAttribute("aRnd", new THREE.Float32BufferAttribute(r, 1));
        const m = pointsMat(size);
        const pts = new THREE.Points(g, m);
        return { pts, g, m };
      };
      const onSphere = (rad: number, jitter = 0) => (): [number, number, number] => {
        const u = Math.random() * 2 - 1, t = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
        const rr = rad + (Math.random() - 0.5) * jitter;
        return [s * Math.cos(t) * rr, u * rr, s * Math.sin(t) * rr];
      };

      // ядро
      const core = layer(1800, () => { const [x, y, z] = onSphere(1)(); const k = Math.cbrt(Math.random()) * 0.42; return [x * k, y * k, z * k]; }, [0.75, 0.8, 1], 2.6);
      // кратковременная — плотная быстрая оболочка
      const short = layer(1400, onSphere(0.78, 0.06), [0.23, 0.51, 0.96], 2.0);
      // долгосрочная — наклонные орбиты
      const longG = new THREE.Group();
      const longLayers: { g: InstanceType<typeof THREE.BufferGeometry>; m: InstanceType<typeof THREE.ShaderMaterial> }[] = [];
      for (let k = 0; k < 4; k++) {
        const L = layer(520, (i) => { const a = (i / 520) * Math.PI * 2; const rr = 1.18 + (Math.random() - 0.5) * 0.05; return [Math.cos(a) * rr, (Math.random() - 0.5) * 0.03, Math.sin(a) * rr]; }, [0.38, 0.65, 0.98], 1.8);
        L.pts.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        longG.add(L.pts); longLayers.push(L);
      }
      // ассоциативная — узлы и связи
      const nodes: InstanceType<typeof THREE.Vector3>[] = [];
      for (let i = 0; i < 46; i++) { const [x, y, z] = onSphere(1.6, 0.25)(); nodes.push(new THREE.Vector3(x, y, z)); }
      const assoc = layer(nodes.length, (i) => [nodes[i].x, nodes[i].y, nodes[i].z], [0.75, 0.86, 1.0], 6.0);
      const lp: number[] = [];
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) if (nodes[i].distanceTo(nodes[j]) < 0.85) lp.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lp, 3));
      const lineMat = new THREE.LineBasicMaterial({ color: 0x93b4ff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      const assocG = new THREE.Group();
      assocG.add(assoc.pts, lines);

      // «воспоминания», летящие к ядру
      const FLY = 70;
      const flyPos = new Float32Array(FLY * 3), flyCol = new Float32Array(FLY * 3), flyRnd = new Float32Array(FLY);
      const flyState = Array.from({ length: FLY }, () => ({ t: Math.random(), a: Math.random() * Math.PI * 2, b: Math.random() * 2 - 1, sp: 0.15 + Math.random() * 0.25 }));
      for (let i = 0; i < FLY; i++) { flyCol.set([0.9, 0.95, 1.0], i * 3); flyRnd[i] = Math.random(); }
      const flyGeo = new THREE.BufferGeometry();
      flyGeo.setAttribute("position", new THREE.BufferAttribute(flyPos, 3));
      flyGeo.setAttribute("color", new THREE.BufferAttribute(flyCol, 3));
      flyGeo.setAttribute("aRnd", new THREE.BufferAttribute(flyRnd, 1));
      const flyMat = pointsMat(3.2);
      const fly = new THREE.Points(flyGeo, flyMat);

      root.add(core.pts, short.pts, longG, assocG, fly);

      const mouse = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", () => { mouse.x = 0; mouse.y = 0; });

      const resize = () => { const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix(); };
      const ro = new ResizeObserver(resize); ro.observe(el); resize();
      let visible = true;
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }); io.observe(el);

      const mats = [core.m, short.m, assoc.m, flyMat, ...longLayers.map((l) => l.m)];
      const clock = new THREE.Clock();
      let raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible) return;
        const t = clock.getElapsedTime(), dt = Math.min(clock.getDelta(), 0.05) || 0.016;
        mats.forEach((m) => (m.uniforms.uTime.value = t));
        core.pts.scale.setScalar(1 + Math.sin(t * 2.2) * 0.04);
        short.pts.rotation.y = t * 0.6; short.pts.rotation.x = t * 0.25;
        longG.rotation.y = t * 0.12; longG.rotation.z = t * 0.05;
        assocG.rotation.y = -t * 0.06;
        lineMat.opacity = 0.16 + Math.sin(t * 1.3) * 0.08;
        for (let i = 0; i < FLY; i++) {
          const s = flyState[i];
          s.t -= s.sp * 0.016;
          if (s.t <= 0) { s.t = 1; s.a = Math.random() * Math.PI * 2; s.b = Math.random() * 2 - 1; }
          const rr = 0.35 + s.t * 1.5, sw = Math.sqrt(1 - s.b * s.b), a = s.a + (1 - s.t) * 2.5;
          flyPos[i * 3] = Math.cos(a) * sw * rr; flyPos[i * 3 + 1] = s.b * rr; flyPos[i * 3 + 2] = Math.sin(a) * sw * rr;
        }
        flyGeo.attributes.position.needsUpdate = true;
        root.rotation.y += (mouse.x * 0.5 - root.rotation.y) * 0.05;
        root.rotation.x += (mouse.y * 0.35 - root.rotation.x) * 0.05;
        void dt;
        renderer.render(scene, camera);
      };
      if (reduce) renderer.render(scene, camera); else frame();

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        el.removeEventListener("pointermove", onMove);
        [core.g, short.g, assoc.g, lineGeo, flyGeo, ...longLayers.map((l) => l.g)].forEach((g) => g.dispose());
        [...mats, lineMat].forEach((m) => m.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    })();
    return () => { disposed = true; cleanup(); };
  }, []);

  const colors = ["#3b82f6", "#60a5fa", "#bfdbfe"];
  return (
    <div className="nal-orb">
      <div ref={host} className="nal-orb-canvas" role="img" aria-label={`${center}: ${labels.join(", ")}`} />
      <ul className="nal-legend">
        {labels.map((l, i) => (
          <li key={l}><i style={{ background: colors[i], boxShadow: `0 0 12px ${colors[i]}` }} />{l}</li>
        ))}
      </ul>
    </div>
  );
}
