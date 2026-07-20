const formations = [
  {
    id: "bts-ciel",
    yearStart: 2024,
    yearEnd: 2026,
    title: "BTS CIEL - Option Réseau",
    school: "CFAI Adour",
    city: "Assat",
    status: "En cours",
    bullets: [
      "Réseau (adressage IPV4, VLAN, DHCP, routage)",
      "Développement (C, C++, JS, HTML, CSS, SQL)",
      "Systèmes (Windows/Windows Server/Linux)",
      "Cybersécurité (Organismes et ISO)",
      "Projet de fin d'année réalisé en entreprise"
    ],
    skills: ["Cybersécurité", "Travail en groupe", "Développement", "Documentation", "Réseau", "Support", "Systèmes"]
  },
  {
    id: "bac",
    yearStart: 2022,
    yearEnd: 2023,
    title: "Baccalaureat Général",
    school: "Lycée de Navarre",
    city: "Saint-Jean-Pied-de-Port",
    status: "Obtenu",
    bullets: [
      "Enseignements généraux et specialités (HGGSP-SES)",
      "Grand Oral"
    ],
    skills: ["Autonomie", "Organisation", "Rigueur", "Travail en groupe"]
  }
];

function buildFormationList() {
  const list = document.getElementById("eduItems");
  if (!list) return;
  list.innerHTML = "";

  const sorted = [...formations].sort((a, b) => b.yearStart - a.yearStart);

  sorted.forEach(f => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "edu-item";
    btn.dataset.id = f.id;

    btn.innerHTML = `
      <div class="edu-left">
        <div class="edu-years">${f.yearStart} - ${f.yearEnd}</div>
        <div class="edu-status">${f.status}</div>
      </div>
      <div class="edu-right">
        <div class="edu-name">${f.title}</div>
        <div class="edu-school muted">${f.school} (${f.city})</div>
      </div>
    `;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectFormation(f.id);
    });

    list.appendChild(btn);
  });

  clearFormationSelection();
}

function clearFormationSelection() {
  document.querySelectorAll(".edu-item").forEach(n => n.classList.remove("selected"));

  const t = document.getElementById("fTitle");
  const m = document.getElementById("fMeta");
  const bullets = document.getElementById("fBullets");
  const tags = document.getElementById("fTags");
  const extra = document.getElementById("eduExtra");

  if (t) t.textContent = "Sélectionnez une formation";
  if (m) m.textContent = "Cliquez sur une ligne a gauche.";
  if (bullets) bullets.innerHTML = "";
  if (tags) tags.innerHTML = "";
  if (extra) extra.classList.add("is-hidden");
}

function selectFormation(id) {
  const f = formations.find(x => x.id === id);
  if (!f) return;

  document.querySelectorAll(".edu-item").forEach(n => {
    n.classList.toggle("selected", n.dataset.id === id);
  });

  const t = document.getElementById("fTitle");
  const m = document.getElementById("fMeta");
  const bullets = document.getElementById("fBullets");
  const tags = document.getElementById("fTags");
  const extra = document.getElementById("eduExtra");

  if (t) t.textContent = f.title;
  if (m) m.textContent = `${f.yearStart} - ${f.yearEnd} · ${f.school} (${f.city}) · ${f.status}`;

  if (bullets) {
    bullets.innerHTML = "";
    (f.bullets || []).forEach(b => {
      const li = document.createElement("li");
      li.textContent = b;
      bullets.appendChild(li);
    });
  }

  if (tags) {
    tags.innerHTML = "";
    (f.skills || []).forEach(s => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = s;
      tags.appendChild(tag);
    });
  }

  if (extra) extra.classList.remove("is-hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  buildFormationList();

  document.addEventListener("click", (e) => {
    if (e.target.closest("#eduGrid")) return;

    clearFormationSelection();
  }, true);
});
