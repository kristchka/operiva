#!/usr/bin/env bash
# Статическая сборка для GitHub Pages: https://<user>.github.io/<repo>/
# Использование: ./scripts/export-github-pages.sh operiva
set -euo pipefail
cd "$(dirname "$0")/.."
REPO="${1:-operiva}"
export NEXT_PUBLIC_BASE_PATH="/$REPO"
./scripts/export-static.sh
touch out/.nojekyll   # иначе GitHub Pages скроет папку _next
echo "Готово для GitHub Pages: out/ (адрес /$REPO/)"
