const experiences = [
  {
    id: "teknico",
    start: "2024-08",
    end: "2026-08",
    title: "Alternance BTS CIEL",
    company: "Teknico",
    city: "Uhart-Cize",
    dateLabel: "août 2024 - août 2026",
    missions: [
      "Dépannage informatique (postes utilisateurs, pannes matérielles, diagnostics logiciels)",
      "Assemblage de postes",
      "Mise en place et maintenance de solutions de sauvegarde sécurisées (exportation de machines virtuelles, de données)",
      "Assistance aux utilisateurs"
    ],
    skills: ["Relation client", "Windows", "Linux", "Réseau", "Sauvegardes", "Support utilisateurs", "Maintenance PC"]
  },
  {
    id: "leclerc-2024",
    start: "2024-06",
    end: "2024-08",
    title: "Employé de mise en rayon",
    company: "E.Leclerc",
    city: "Aicirits-Camou-Suhast",
    dateLabel: "juin 2024 - août 2024",
    missions: ["Employé de libre service (rayon liquide)"],
    skills: ["Rigueur", "Autonomie", "Organisation", "Travail en équipe"]
  },
  {
    id: "leclerc-2023",
    start: "2023-06",
    end: "2023-09",
    title: "Employé de mise en rayon / Hôte de caisse",
    company: "E.Leclerc",
    city: "Sauveterre-de-Bearn",
    dateLabel: "juin 2023 - sept. 2023",
    missions: ["Hôte de caisse", "Mise en rayon"],
    skills: ["Relation client", "Autonomie", "Organisation", "Travail en équipe"]
  },
  {
    id: "mais-2021",
    start: "2021-08",
    end: "2021-08",
    title: "Employé saisonnier",
    company: "Castreur de mais",
    city: "St-Julien-en-Born",
    dateLabel: "août 2021",
    missions: ["Travail saisonnier"],
    skills: ["Autonomie", "Rigueur"]
  },
  {
    id: "mais-2019",
    start: "2019-08",
    end: "2019-08",
    title: "Employé saisonnier",
    company: "Castreur de mais",
    city: "Luxe Sumberraute",
    dateLabel: "août 2019",
    missions: ["Travail saisonnier"],
    skills: ["Autonomie", "Rigueur"]
  }
];

function ymToIndex(ym) {
  const [y, m] = ym.split("-").map(n => parseInt(n, 10));
  return (y * 12) + (m - 1);
}

function getSpanMonths() {
  const starts = experiences.map(e => ymToIndex(e.start));
  const ends = experiences.map(e => ymToIndex(e.end));
  return { minM: Math.min(...starts), maxM: Math.max(...ends) };
}

function createItem(exp) {
  const item = document.createElement("button");
  item.className = "tl-item";
  item.type = "button";
  item.dataset.id = exp.id;
  item.setAttribute("aria-label", `${exp.title} - ${exp.company} (${exp.city})`);
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    selectExperience(exp.id);
  });

  const isUp = (exp.id.length % 2 === 0);
  item.dataset.side = isUp ? "up" : "down";

  const stem = document.createElement("span");
  stem.className = "tl-stem";

  const dot = document.createElement("span");
  dot.className = "tl-dot";

  const card = document.createElement("span");
  card.className = "tl-card";
  card.innerHTML = `
    <span class="tl-title">${exp.title}</span>
    <span class="tl-sub">${exp.company} (${exp.city})</span>
    <span class="tl-date">${exp.dateLabel}</span>
  `;

  item.appendChild(stem);
  item.appendChild(dot);
  item.appendChild(card);

  return item;
}

function buildTimeline() {
  const el = document.getElementById("timeline");
  if (!el) return;

  el.innerHTML = "";

  const { minM, maxM } = getSpanMonths();
  const pxPerMonth = 28;
  const totalMonths = (maxM - minM) + 1;

  el.style.width = `${totalMonths * pxPerMonth + 140}px`;

  const axis = document.createElement("div");
  axis.className = "tl-axis";
  el.appendChild(axis);

  const minYear = Math.floor(minM / 12);
  const maxYear = Math.floor(maxM / 12);

  for (let y = minYear; y <= maxYear; y++) {
    const x = ((y * 12) - minM) * pxPerMonth + 40;

    const tick = document.createElement("div");
    tick.className = "tl-year";
    tick.style.left = `${x}px`;
    tick.textContent = y;

    const line = document.createElement("div");
    line.className = "tl-year-line";
    line.style.left = `${x}px`;

    el.appendChild(line);
    el.appendChild(tick);
  }

  const sorted = [...experiences].sort((a, b) => ymToIndex(b.start) - ymToIndex(a.start));

  sorted.forEach(exp => {
    const startM = ymToIndex(exp.start);
    const endM = ymToIndex(exp.end);

    const xStart = (startM - minM) * pxPerMonth + 40;
    const xEnd = ((endM + 1) - minM) * pxPerMonth + 40;

    const w = Math.max(220, Math.min(900, xEnd - xStart));

    const item = createItem(exp);
    item.style.left = `${xStart}px`;
    item.style.setProperty("--w", `${w}px`);

    el.appendChild(item);
  });

  clearSelection();
}

function clearSelection() {
  document.querySelectorAll(".tl-item").forEach(n => n.classList.remove("selected"));

  const t = document.getElementById("dTitle");
  const m = document.getElementById("dMeta");
  const missionsEl = document.getElementById("dMissions");
  const tagsEl = document.getElementById("dTags");
  const extra = document.getElementById("detailsExtra");

  if (t) t.textContent = "Sélectionnez une expérience";
  if (m) m.textContent = "Cliquez sur une activité de la frise.";

  if (missionsEl) missionsEl.innerHTML = "";
  if (tagsEl) tagsEl.innerHTML = "";

  if (extra) extra.classList.add("is-hidden");
}

function selectExperience(id) {
  const exp = experiences.find(e => e.id === id);
  if (!exp) return;

  document.querySelectorAll(".tl-item").forEach(n => {
    n.classList.toggle("selected", n.dataset.id === id);
  });

  const t = document.getElementById("dTitle");
  const m = document.getElementById("dMeta");
  const missionsEl = document.getElementById("dMissions");
  const tagsEl = document.getElementById("dTags");
  const extra = document.getElementById("detailsExtra");

  if (t) t.textContent = `${exp.title} - ${exp.company} (${exp.city})`;
  if (m) m.textContent = exp.dateLabel;

  if (missionsEl) {
    missionsEl.innerHTML = "";
    exp.missions.forEach(ms => {
      const li = document.createElement("li");
      li.textContent = ms;
      missionsEl.appendChild(li);
    });
  }

  if (tagsEl) {
    tagsEl.innerHTML = "";
    exp.skills.forEach(s => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = s;
      tagsEl.appendChild(tag);
    });
  }

  if (extra) extra.classList.remove("is-hidden");
}

function enableDragScroll() {
  const wrap = document.querySelector(".timeline-wrap");
  if (!wrap) return;

  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  wrap.addEventListener("mousedown", (e) => {
    isDown = true;
    wrap.classList.add("dragging");
    startX = e.pageX;
    startScroll = wrap.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    wrap.classList.remove("dragging");
  });

  wrap.addEventListener("mouseleave", () => {
    isDown = false;
    wrap.classList.remove("dragging");
  });

  wrap.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    wrap.scrollLeft = startScroll - dx;
  });

  wrap.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      wrap.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });
}

document.addEventListener("DOMContentLoaded", () => {
  buildTimeline();
  enableDragScroll();

  const wrap = document.querySelector(".timeline-wrap");
  if (!wrap) return;

  let dragged = false;

  wrap.addEventListener("mousemove", () => {
    if (wrap.classList.contains("dragging")) dragged = true;
  });

  window.addEventListener("mouseup", () => {
    setTimeout(() => { dragged = false; }, 0);
  });

  document.addEventListener("click", (e) => {
    if (dragged) return;

    if (e.target.closest(".timeline-wrap") || e.target.closest(".details")) return;

    clearSelection();
  }, true);
});
