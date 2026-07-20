const skillGroups = [
  {
    title: "Réseau",
    desc: "Configuration, compréhension et recherche de pannes",
    tags: [
      { label: "IPv4", level: "moyen" },
      { label: "DHCP", level: "operationnel" },
      { label: "VLAN", level: "operationnel" },
      { label: "Routage", level: "operationnel" },
      { label: "LAN / WAN", level: "moyen" },
      { label: "Cisco Packet Tracer", level: "moyen" },
      { label: "Dépannage réseau", level: "operationnel" }
    ]
  },
  {
    title: "Systèmes",
    desc: "Installation, maintenance et utilisation au quotidien",
    tags: [
      { label: "Windows", level: "moyen" },
      { label: "Windows Server", level: "moyen" },
      { label: "Linux", level: "moyen" },
      { label: "Comptes / droits", level: "bases" },
      { label: "Installation postes", level: "operationnel" },
      { label: "Diagnostic (matériel/logiciel)", level: "moyen" }
    ]
  },
  {
    title: "Sauvegardes",
    desc: "Automatisation, contrôle et suivi des sauvegardes",
    tags: [
      { label: "Stratégies de sauvegarde", level: "operationnel" },
      { label: "Rotation / conservation", level: "operationnel" },
      { label: "Export / copie vers NAS", level: "operationnel" },
      { label: "Vérifications / tests", level: "operationnel" },
      { label: "Sensibilisation", level: "operationnel" }
    ]
  },
  {
    title: "Support et terrain",
    desc: "Interventions concrètes et accompagnement des utilisateurs",
    tags: [
      { label: "Support utilisateurs", level: "operationnel" },
      { label: "Prise en charge incidents", level: "moyen" },
      "Relation client",
      "Rigueur",
      "Autonomie",
      "Travail en équipe"
    ]
  },
  {
    title: "Cybersécurité",
    desc: "Des réflexes appliqués dans chaque intervention",
    tags: [
      { label: "Bonnes pratiques", level: "operationnel" },
      { label: "Principes ISO", level: "operationnel" },
      { label: "Risques", level: "operationnel" },
      { label: "Documentation procédures", level: "operationnel" },
      { label: "Sensibilisation", level: "operationnel" }
    ]
  },
  {
    title: "Langues",
    desc: "Anglais technique utilisé pour la documentation",
    tags: [
      { label: "Anglais (B1/B2)", level: "operationnel" },
      { label: "Lecture de documentation technique", level: "operationnel" }
    ]
  }
];

// Ordre d'affichage : opérationnel/avancé en premier, puis moyen, puis bases
const LEVEL_ORDER = { operationnel: 0, avance: 0, moyen: 1, bases: 2 };

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function updateCount() {
  const countEl = document.getElementById("skillCount");
  if (!countEl) return;

  const visibleTags = [...document.querySelectorAll(".tag")]
    .filter(t => !t.classList.contains("is-hidden")).length;

  countEl.textContent = `${visibleTags} competences affichees`;
}

function buildSkills() {
  const grid = document.getElementById("skillsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  skillGroups.forEach(g => {
    const card = document.createElement("div");
    card.className = "card skill-card";

    const tagsSorted = [...(g.tags || [])].sort((a, b) => {
      const la = (typeof a === "string") ? "" : (a.level || "bases").toLowerCase();
      const lb = (typeof b === "string") ? "" : (b.level || "bases").toLowerCase();

      const oa = (typeof a === "string") ? 99 : (LEVEL_ORDER[la] ?? 9);
      const ob = (typeof b === "string") ? 99 : (LEVEL_ORDER[lb] ?? 9);

      return oa - ob;
    });

    const tagsHtml = tagsSorted.map(t => {
      if (typeof t === "string") {
        return `
          <span class="tag level-qualite" data-skill="${t} qualite" data-tooltip="${t}">
            <span class="tag-text">${t}</span>
            <span class="tag-badge">Qualité</span>
          </span>
        `;
      }

      const label = t.label || "";
      let level = (t.level || "bases").toLowerCase();

      // Compat: si jamais tu as encore "avancé" quelque part
      if (level === "avancé") level = "avance";

      const data = `${label} ${level}`;

      return `
        <span class="tag level-${level}" data-skill="${data}" data-tooltip="${label}">
          <span class="tag-text">${label}</span>
          <span class="tag-badge">${level === "avance" ? "Avancé" : (level === "operationnel" ? "Opérationnel" : level)}</span>
        </span>
      `;
    }).join("");

    card.innerHTML = `
      <h2 class="skill-title">${g.title}</h2>
      <p class="muted">${g.desc}</p>
      <div class="tags skill-tags">${tagsHtml}</div>
    `;

    grid.appendChild(card);
  });

  updateCount();
}

function applyFilter(q) {
  const query = normalize(q);

  if (!query) {
    document.querySelectorAll(".tag").forEach(t => t.classList.remove("is-hidden"));
    document.querySelectorAll(".skill-card").forEach(c => c.classList.remove("is-hidden"));
    updateCount();
    return;
  }

  document.querySelectorAll(".skill-card").forEach(card => {
    const tags = [...card.querySelectorAll(".tag")];
    let anyVisible = false;

    tags.forEach(tag => {
      const val = tag.getAttribute("data-skill") || tag.textContent || "";
      const ok = normalize(val).includes(query);
      tag.classList.toggle("is-hidden", !ok);
      if (ok) anyVisible = true;
    });

    card.classList.toggle("is-hidden", !anyVisible);
  });

  updateCount();
}

document.addEventListener("DOMContentLoaded", () => {
  buildSkills();

  const input = document.getElementById("skillSearch");
  const btnClear = document.getElementById("btnClearSkills");

  if (input) {
    input.addEventListener("input", () => applyFilter(input.value));
  }

  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (input) input.value = "";
      applyFilter("");
      if (input) input.focus();
    });
  }

  const tip = document.createElement("div");
  tip.className = "skill-tooltip";
  document.body.appendChild(tip);

  function hideTip() {
    tip.style.display = "none";
  }

  function showTip(text, rect) {
    tip.textContent = text;

    tip.style.display = "block";
    tip.style.left = "0px";
    tip.style.top = "0px";

    const margin = 10;
    const padding = 12;

    let x = rect.left;
    let y = rect.bottom + margin;

    const tipRect = tip.getBoundingClientRect();

    const maxX = window.innerWidth - tipRect.width - padding;
    if (x > maxX) x = maxX;
    if (x < padding) x = padding;

    if (y + tipRect.height + padding > window.innerHeight) {
      y = rect.top - tipRect.height - margin;
    }

    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
  }

  function handleMove(e) {
    const tag = e.target.closest(".skill-tags .tag");
    if (!tag) {
      hideTip();
      return;
    }

    const text = tag.getAttribute("data-tooltip");
    if (!text || tag.classList.contains("is-hidden")) {
      hideTip();
      return;
    }

    const rect = tag.getBoundingClientRect();
    showTip(text, rect);
  }

  document.addEventListener("mouseover", handleMove);
  document.addEventListener("mousemove", handleMove);

  document.addEventListener("mouseout", (e) => {
    const tag = e.target.closest(".skill-tags .tag");
    if (tag) hideTip();
  });

  window.addEventListener("scroll", hideTip, true);
  window.addEventListener("resize", hideTip);
});



