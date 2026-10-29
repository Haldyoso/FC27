// Môj aktuálny tím + analýza. Claude tento súbor prepíše vždy, keď pošlem novú zostavu.
//
// Formát hráča:
// {
//   pos: "ST",                 // pozícia v zostave (GK, LB, CB, RB, CDM, CM, CAM, LW, RW, ST ...)
//   name: "Meno Priezvisko",
//   rating: 84,
//   version: "Gold Rare",      // typ karty (Gold Rare, TOTW, Evo, SBC ...)
//   price: "3.2K",             // aktuálna cena na trhu, voliteľné
//   stats: { pac: 90, sho: 80, pas: 75, dri: 84, def: 40, phy: 70 },
//   playstyles: ["Rapid+", "Low Driven"],
//   bench: false,              // true = náhradník
//   verdict: "keep",           // keep | upgrade | sell | watch
//   note: "Prečo držať / meniť.",
//   replace: [ { name: "Kto namiesto neho", rating: 85, price: "5K", why: "Prečo je lepší" } ]
// }
window.FC27_TEAM = {
  updated: null,             // "2026-10-29"
  mode: "Ultimate Team",
  formation: null,           // "4-2-1-3"
  budget: null,              // voľné coiny na prestupy, napr. "25K"
  profile: {
    division: 10,            // aktuálna divízia v Division Rivals (10 = najnižšia)
    goal: 7                  // cieľová divízia
  },
  summary: null,             // krátke celkové zhodnotenie tímu
  players: [],
  priorities: [],            // poradie nákupov, napr. ["1. Rýchly stopér (do 5K) namiesto ...", ...]
  history: []                // [{ date: "2026-10-29", text: "Prvá analýza tímu" }]
};
