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

# Push iba ak je lokálna vetva pred origin/main (alebo origin/main ešte neexistuje).
if ! git rev-parse --verify -q origin/main >/dev/null || [ -n "$(git log origin/main..HEAD --oneline)" ]; then
  if git push -q origin HEAD:main >/dev/null 2>&1; then
    echo '{"systemMessage":"FC27: zmeny pushnuté na GitHub"}'
  else
    echo '{"systemMessage":"FC27: push na GitHub zlyhal – skontroluj prihlásenie (git push origin main)"}'
  fi
fi
exit 0
