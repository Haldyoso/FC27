#!/usr/bin/env bash
# Stop hook: po každej odpovedi Clauda commitne a pushne všetko, čo ostalo necommitnuté.
# Stránka na GitHub Pages sa potom sama prebuduje.

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -q \
    -m "Automatická aktualizácia ($(date '+%Y-%m-%d %H:%M'))" \
    -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || exit 0
fi

# GitHub Pages sa publikuje z vetvy gh-pages, preto pushujeme HEAD do main aj gh-pages.
# Push iba ak sa niektorá z nich líši od lokálneho HEAD.
head=$(git rev-parse HEAD)
if [ "$head" != "$(git rev-parse -q --verify origin/main)" ] || [ "$head" != "$(git rev-parse -q --verify origin/gh-pages)" ]; then
  if git push -q origin HEAD:main HEAD:gh-pages >/dev/null 2>&1; then
    echo '{"systemMessage":"FC27: zmeny pushnuté na GitHub"}'
  else
    echo '{"systemMessage":"FC27: push na GitHub zlyhal – skontroluj prihlásenie (git push origin main)"}'
  fi
fi
exit 0
