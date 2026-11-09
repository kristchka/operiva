#!/usr/bin/env bash
# Собирает статическую версию сайта в папку out/ (без серверной части).
set -euo pipefail
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
restore() { [ -f "$tmp/proxy.ts" ] && mv "$tmp/proxy.ts" proxy.ts; [ -d "$tmp/api" ] && mv "$tmp/api" app/api; rm -rf "$tmp"; }
trap restore EXIT
mv proxy.ts "$tmp/proxy.ts"
mv app/api "$tmp/api"
rm -rf out
STATIC_EXPORT=1 NEXT_PUBLIC_STATIC_EXPORT=1 npx next build
# Корень: отправляем на язык браузера или русский.
cat > out/index.html <<'HTML'
<!doctype html><html><head><meta charset="utf-8"><title>OPERIVA — AISI LAB</title>
<script>var l=(navigator.language||"ru").slice(0,2),s=["ru","en","de","es","it","fr","ka","pt"];location.replace("./"+(s.indexOf(l)>-1?l:"ru")+"/index.html");</script>
<meta http-equiv="refresh" content="0;url=./ru/index.html"></head><body></body></html>
HTML
echo "Готово: out/"

# Для хостинга, где папки с «_» в начале зарезервированы (например, артефакты Claude):
#   ./scripts/export-static.sh && python3 scripts/flatten-for-artifact.py out
