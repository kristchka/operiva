// Сборка operiva.tech для Cloudflare Pages (проект operiva-site-v2).
//
// Команда и каталоги прежние: из папки site выполнить `node build.mjs`, результат — site/dist,
// функции — site/functions (Pages берёт их из корня проекта рядом с каталогом сборки).
//
// С ноября 2026 сайт — статический экспорт макета на Next.js. Он собирается заранее
// (исходники — ветка source репозитория kristchka/operiva, команда scripts/export-operiva-tech.sh)
// и лежит готовым в site/next-export. Здесь он только копируется в dist, к нему добавляются
// иконки сайта и отметка сборки. Сторонних зависимостей и npm install не нужно.
//
// Прежняя сборка (страницы из site/src) сохранена как build-legacy.mjs.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'next-export');
const OUT = path.join(ROOT, 'dist');

if (!fs.existsSync(path.join(SRC, 'index.html'))) {
  console.error('Нет site/next-export/index.html — сборка остановлена, чтобы не опубликовать пустой сайт.');
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true });

// Иконки по фиксированным адресам (/favicon.ico, /site.webmanifest): их запрашивают браузеры
// и мобильные системы, поэтому берём прежний набор из site/src/icons, если он есть.
const ICONS = path.join(ROOT, 'src', 'icons');
for (const f of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest']) {
  const p = path.join(ICONS, f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(OUT, f));
}

// Отметка сборки: /version.txt — с него начинается проверка опубликованной версии.
const sh = (c) => { try { return execSync(c, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return ''; } };
const COMMIT = (process.env.CF_PAGES_COMMIT_SHA || sh('git rev-parse HEAD') || 'unknown').slice(0, 8);
const BRANCH = process.env.CF_PAGES_BRANCH || sh('git rev-parse --abbrev-ref HEAD') || 'unknown';
const BUILT = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const SOURCE = fs.existsSync(path.join(SRC, 'SOURCE.txt')) ? fs.readFileSync(path.join(SRC, 'SOURCE.txt'), 'utf8').trim() : '';
fs.rmSync(path.join(OUT, 'SOURCE.txt'), { force: true });
fs.writeFileSync(path.join(OUT, 'version.txt'), `commit: ${COMMIT}\nbranch: ${BRANCH}\nbuilt:  ${BUILT}\n${SOURCE ? SOURCE + '\n' : ''}`);

let pages = 0;
(function walk(d) { for (const n of fs.readdirSync(d)) { const p = path.join(d, n); if (fs.statSync(p).isDirectory()) walk(p); else if (n.endsWith('.html')) pages++; } })(OUT);
console.log(`operiva.tech: страниц ${pages}, сборка ${COMMIT} · ${BRANCH}`);
