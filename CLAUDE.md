# FC27 Coach – pravidlá pre Clauda

Statická stránka (bez build kroku) pre GitHub Pages: https://haldyoso.github.io/FC27/
Repo: https://github.com/Haldyoso/FC27 (verejné).

## Používateľ

- Píše po slovensky – odpovedaj aj píš obsah stránky po slovensky (s diakritikou).
- Hrá EA SPORTS FC 27 na PC s **Xbox ovládačom** – všetky ovládania uvádzaj pre Xbox (A/B/X/Y, LB/RB/LT/RT, LS/RS).
- Je začiatočník, Division Rivals okolo Div 10–9. Rady majú byť jednoduché, praktické, krok za krokom.

## Po každej úprave: commit + push

Po každej zmene súborov v tomto repe **vždy** sprav commit s výstižnou správou (po slovensky) a push:

```bash
git add -A
git commit -m "Popis zmeny"
git push origin main main:gh-pages
```

GitHub Pages sa publikuje z vetvy **`gh-pages`** – vždy pushuj `main` aj `gh-pages` (rovnaký commit). Stránka sa prebuduje do 1–2 minút.

Pre istotu je v `.claude/settings.json` aj Stop hook (`.claude/hooks/auto-push.sh`), ktorý na konci každej odpovede commitne a pushne všetko, čo ostalo necommitnuté.

## Štruktúra

- `index.html` – všetok statický obsah (sekcie: prehľad, roadmapa, strely, triky, obrana, taktika, gems, tím, nastavenia). Pri zmene obsahu uprav dátum „Aktualizované“ v hero sekcii.
- `assets/style.css` – dizajn, farby ako CSS premenné (svetlý aj tmavý režim).
- `assets/app.js` – roadmapa (localStorage), aktívna navigácia, vykreslenie tímu.
- `data/team.js` – tím používateľa + analýza (formát je popísaný v komentári v súbore).

## Keď používateľ pošle tím

1. Prepíš `data/team.js`: `updated`, `formation`, `budget`, `players` (s `verdict` a `replace`), `priorities`, `summary`, a pridaj záznam do `history`.
2. Pri návrhoch výmen over aktuálne ceny (napr. fut.gg, futbin) – ceny sa rýchlo menia. Uvádzaj približnú cenu a dátum.
3. Zohľadni úroveň hráča: tempo a akcelerácia > PlayStyles, bezpečná obrana > útočné roly.
4. Ak treba, aktualizuj aj `profile.division` (aktuálna divízia).

## Obsah

- Fakty o FC 27 (ovládanie, meta, ceny) over z aktuálnych zdrojov a pridaj ich do zoznamu zdrojov v pätičke.
- Meta sa mení s patchmi – pri väčšej aktualizácii skontroluj nové Pitch Notes od EA.
