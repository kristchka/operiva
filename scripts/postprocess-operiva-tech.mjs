// Превращает статический экспорт Next (out/) в раскладку действующего operiva.tech (out-tech/).
//
//   out/ru.html, out/ru/*   → корень (русская версия без префикса, как на прежнем сайте)
//   out/en.html, out/en/*   → /en, /en/… (Cloudflare Pages отдаёт x.html по адресу /x)
//   *.txt (служебные файлы Next для клиентских переходов) не копируются: ссылки на сайте —
//   обычные <a>, переходы идут полной загрузкой страницы.
//
// _redirects дополняет прежние редиректы сайта 301-ми с адресов, которых больше нет.
import fs from "node:fs";
import path from "node:path";

const [src = "out", dst = "out-tech"] = process.argv.slice(2);
fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(dst, { recursive: true });

const KEEP_TXT = new Set(["robots.txt"]);
const SKIP = new Set(["_not-found", "_not-found.html", "ru", "ru.html", "index.html"]);

function copy(from, to) {
  const st = fs.statSync(from);
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(from)) copy(path.join(from, name), path.join(to, name));
    return;
  }
  if (from.endsWith(".txt") && !KEEP_TXT.has(path.basename(from))) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

for (const name of fs.readdirSync(src)) {
  if (SKIP.has(name)) continue;
  copy(path.join(src, name), path.join(dst, name));
}
// Русская версия — в корень.
copy(path.join(src, "ru"), dst);
fs.copyFileSync(path.join(src, "ru.html"), path.join(dst, "index.html"));

if (!fs.existsSync(path.join(dst, "404.html"))) throw new Error("нет 404.html — Pages вернёт главную вместо 404");

// ─── редиректы ───
const LANGS = ["en", "de", "es", "it", "fr", "ka", "pt"];
const moved = [
  // прежние адреса operiva.tech (сборка master от 12.08.2026)
  ["/platform", "/laboratory"],
  ["/industries", "/products"],
  // адреса демо-версии макета (GitHub Pages) → адреса operiva.tech
  ["/lab", "/laboratory"],
  ["/aisi-lab/hotels", "/aisi-lab"],
  ["/ai-workforce", "/workforce"],
  ["/methodology", "/implementation"],
  ["/data-processing", "/data"],
];
const lines = [
  "# Прежние редиректы сайта (site/build.mjs, master 12.08.2026)",
  "/index.html            /              301",
  "/cases.html            /cases/tiflis  301",
  "/telegram-submit.php   /contact       301",
  "",
  "# Страницы, которые заменены новыми",
  ...moved.map(([a, b]) => `${a.padEnd(22)} ${b.padEnd(14)} 301`),
  ...LANGS.flatMap((l) => moved.map(([a, b]) => `/${l}${a} /${l}${b} 301`)),
  "",
  "# Русская версия живёт в корне: ссылки вида /ru/… ведут туда же",
  "/ru                    /              301",
  "/ru/*                  /:splat        301",
  "",
];
fs.writeFileSync(path.join(dst, "_redirects"), lines.join("\n"));

// Заголовки: длинный кэш для файлов с хешем в имени, остальное — как было.
fs.writeFileSync(path.join(dst, "_headers"), `/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`);

const pages = [];
(function walk(dir) {
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) { if (n !== "_next") walk(p); }
    else if (n.endsWith(".html")) pages.push(path.relative(dst, p));
  }
})(dst);
console.log(`страниц: ${pages.length}`);
