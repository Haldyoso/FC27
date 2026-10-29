(function () {
  "use strict";

  var team = window.FC27_TEAM || {};
  var profile = team.profile || {};

  // ---------- small helpers ----------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === "class") node.className = attrs[key];
        else if (key === "text") node.textContent = attrs[key];
        else node.setAttribute(key, attrs[key]);
      });
    }
    (children || []).forEach(function (child) {
      if (child == null) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked – ignore */ }
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return Number(parts[2]) + ". " + Number(parts[1]) + ". " + parts[0];
  }

  // ---------- division tracker ----------
  function renderDivisions() {
    var current = Number(profile.division) || 10;
    var goal = Number(profile.goal) || 7;
    var track = document.getElementById("div-track");
    var chipDiv = document.getElementById("chip-div");
    var chipGoal = document.getElementById("chip-goal");
    if (chipDiv) chipDiv.textContent = "Div " + current;
    if (chipGoal) chipGoal.textContent = "Div " + goal;
    if (!track) return;

    for (var d = 10; d >= 0; d--) {
      var label = d === 0 ? "Elite" : String(d);
      var cls = [];
      if (d > current) cls.push("done");
      if (d === current) cls.push("now");
      if (d === goal) cls.push("goal");
      track.appendChild(el("span", { class: cls.join(" "), text: label }));
    }
  }

  // ---------- roadmap checkboxes ----------
  function initRoadmap() {
    var phases = document.querySelectorAll(".phase");
    phases.forEach(function (phase) {
      var id = phase.getAttribute("data-phase");
      var boxes = phase.querySelectorAll('input[type="checkbox"]');
      var bar = phase.querySelector(".progress div");

      function update() {
        var done = 0;
        boxes.forEach(function (box) { if (box.checked) done++; });
        if (bar) bar.style.width = (boxes.length ? (done / boxes.length) * 100 : 0) + "%";
      }

      boxes.forEach(function (box, i) {
        var key = "fc27-roadmap-" + id + "-" + i;
        box.checked = storageGet(key) === "1";
        box.addEventListener("change", function () {
          storageSet(key, box.checked ? "1" : "0");
          update();
        });
      });
      update();
    });
  }

  // ---------- active nav link ----------
  function initNav() {
    var links = document.querySelectorAll(".nav a");
    if (!("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        var link = map[entry.target.id];
        if (link) {
          link.classList.add("active");
          link.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    document.querySelectorAll("main section[id]").forEach(function (s) { observer.observe(s); });
  }

  // ---------- team ----------
  var VERDICTS = {
    keep: "Držať",
    upgrade: "Vymeniť",
    sell: "Predať",
    watch: "Sledovať"
  };

  var LINES = [
    { title: "Útok", pos: ["ST", "CF", "LW", "RW", "LF", "RF"] },
    { title: "Stred", pos: ["CAM", "CM", "LM", "RM", "CDM"] },
    { title: "Obrana", pos: ["LB", "RB", "CB", "LWB", "RWB"] },
    { title: "Brankár", pos: ["GK"] }
  ];

  function playerCard(p) {
    var stats = p.stats || {};
    var statKeys = [["pac", "PAC"], ["sho", "SHO"], ["pas", "PAS"], ["dri", "DRI"], ["def", "DEF"], ["phy", "PHY"]];
    var hasStats = statKeys.some(function (k) { return stats[k[0]] != null; });

    var verdict = p.verdict && VERDICTS[p.verdict]
      ? el("span", { class: "verdict " + p.verdict, text: VERDICTS[p.verdict] })
      : null;

    var swap = null;
    if (p.replace && p.replace.length) {
      swap = el("div", { class: "swap" }, [
        el("b", { text: "Za koho vymeniť" }),
        el("ul", null, p.replace.map(function (r) {
          var head = r.name + (r.rating ? " (" + r.rating + ")" : "") + (r.price ? " · " + r.price : "");
          return el("li", null, [el("strong", { text: head }), r.why ? " – " + r.why : ""]);
        }))
      ]);
    }

    return el("div", { class: "card player" }, [
      el("div", { class: "row" }, [
        el("span", { class: "pos", text: p.pos || "?" }),
        verdict
      ]),
      el("div", { class: "row" }, [
        el("div", null, [
          el("div", { class: "name", text: p.name || "Neznámy hráč" }),
          el("div", { class: "ver", text: [p.version, p.price].filter(Boolean).join(" · ") })
        ]),
        p.rating ? el("span", { class: "rating", text: String(p.rating) }) : null
      ]),
      hasStats ? el("div", { class: "stats" }, statKeys.map(function (k) {
        return el("div", null, [el("small", { text: k[1] }), el("b", { text: stats[k[0]] != null ? String(stats[k[0]]) : "–" })]);
      })) : null,
      p.playstyles && p.playstyles.length
        ? el("div", { class: "pills" }, p.playstyles.map(function (s) { return el("span", { class: "pill ps", text: s }); }))
        : null,
      p.note ? el("p", { class: "note-text", text: p.note }) : null,
      swap
    ]);
  }

  function renderEmptyTeam(root) {
    root.appendChild(el("div", { class: "card empty-team" }, [
      el("div", { class: "big", text: "📋" }),
      el("h3", { text: "Tím ešte nie je nahraný" }),
      el("p", { class: "goalline", text: "Pošli Claudovi svoju zostavu a tu sa objaví analýza: koho držať, koho predať a za koho ho vymeniť v rámci rozpočtu." }),
      el("ol", null, [
        el("li", { text: "Screenshot zostavy z Ultimate Team → Squads (alebo zoznam: pozícia, meno, rating)." }),
        el("li", { text: "Koľko máš coinov na prestupy." }),
        el("li", { text: "Čo ti v zápasoch najviac vadí (napr. pomalí obrancovia, útočník nedáva góly)." })
      ])
    ]));
  }

  function renderTeam() {
    var root = document.getElementById("team-root");
    if (!root) return;
    var players = team.players || [];
    if (!players.length) { renderEmptyTeam(root); return; }

    var starters = players.filter(function (p) { return !p.bench; });
    var bench = players.filter(function (p) { return p.bench; });
    var rated = starters.filter(function (p) { return p.rating; });
    var avg = rated.length
      ? (rated.reduce(function (s, p) { return s + Number(p.rating); }, 0) / rated.length).toFixed(1)
      : null;

    var head = el("div", { class: "team-head" }, [
      team.formation ? el("span", { class: "chip" }, ["Formácia: ", el("b", { text: team.formation })]) : null,
      avg ? el("span", { class: "chip" }, ["Priemer základnej 11: ", el("b", { text: avg })]) : null,
      team.budget ? el("span", { class: "chip" }, ["Rozpočet: ", el("b", { text: team.budget })]) : null,
      team.updated ? el("span", { class: "chip" }, ["Analýza z: ", el("b", { text: formatDate(team.updated) })]) : null
    ]);
    root.appendChild(head);

    if (team.summary) root.appendChild(el("div", { class: "note" }, [el("strong", { text: "Zhrnutie: " }), team.summary]));

    if (team.priorities && team.priorities.length) {
      root.appendChild(el("div", { class: "card", style: "margin-bottom: 8px;" }, [
        el("h3", { text: "Priorita prestupov" }),
        el("ol", null, team.priorities.map(function (t) { return el("li", { text: t.replace(/^\d+\.\s*/, "") }); }))
      ]));
    }

    var used = {};
    LINES.forEach(function (line) {
      var group = starters.filter(function (p) {
        var match = line.pos.indexOf(String(p.pos).toUpperCase()) !== -1;
        if (match) used[players.indexOf(p)] = true;
        return match;
      });
      if (!group.length) return;
      root.appendChild(el("div", { class: "team-line" }, [
        el("h3", { text: line.title }),
        el("div", { class: "grid grid-3" }, group.map(playerCard))
      ]));
    });

    var other = starters.filter(function (p) { return !used[players.indexOf(p)]; });
    if (other.length) {
      root.appendChild(el("div", { class: "team-line" }, [
        el("h3", { text: "Ostatní" }),
        el("div", { class: "grid grid-3" }, other.map(playerCard))
      ]));
    }

    if (bench.length) {
      root.appendChild(el("div", { class: "team-line" }, [
        el("h3", { text: "Lavička" }),
        el("div", { class: "grid grid-3" }, bench.map(playerCard))
      ]));
    }

    if (team.history && team.history.length) {
      root.appendChild(el("div", { class: "card", style: "margin-top: 24px;" }, [
        el("h3", { text: "História zmien" }),
        el("ul", null, team.history.map(function (h) {
          return el("li", null, [el("strong", { text: formatDate(h.date) + ": " }), h.text]);
        }))
      ]));
    }
  }

  renderDivisions();
  initRoadmap();
  initNav();
  renderTeam();
})();
