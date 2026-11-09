#!/usr/bin/env bash
# Сборка для действующего operiva.tech (Cloudflare Pages, проект operiva-site-v2).
#   — русская версия без префикса, как на прежнем сайте; остальные языки — /en, /de, …
#   — адреса без .html и без слеша в конце: /workforce, /cases/tiflis, …
#   — форма отправляет на /api/lead (функция site/functions/api/lead.js в репозитории сайта).
# Результат: папка out-tech/ — её содержимое кладётся в site/next-export/ репозитория operiva-site-v2.
set -euo pipefail
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
restore() { [ -f "$tmp/proxy.ts" ] && mv "$tmp/proxy.ts" proxy.ts; [ -d "$tmp/api" ] && mv "$tmp/api" app/api; rm -rf "$tmp"; }
trap restore EXIT
mv proxy.ts "$tmp/proxy.ts"
mv app/api "$tmp/api"
rm -rf out out-tech
STATIC_EXPORT=1 NEXT_PUBLIC_STATIC_EXPORT=1 NEXT_PUBLIC_CLEAN_URLS=1 \
  NEXT_PUBLIC_SITE_URL=https://operiva.tech npx next build
node scripts/postprocess-operiva-tech.mjs out out-tech
echo "Готово: out-tech/"
