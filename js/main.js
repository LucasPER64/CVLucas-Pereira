document.addEventListener("DOMContentLoaded", () => {
  const currentYear = String(new Date().getFullYear());

  document.querySelectorAll(".site-footer small").forEach((footerText) => {
    footerText.textContent = footerText.textContent.replace(/\b20\d{2}\b/, currentYear);
  });

  const page = window.location.pathname.split("/").pop() || "index.html";
  const nav = document.querySelector(".nav");

  if (nav) {
    nav.setAttribute("aria-label", "Navigation principale");

    nav.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href");
      const isProjectPage = page.startsWith("projet") && href === "projets.html";
      const isCurrent = href === page || isProjectPage;

      link.classList.toggle("active", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }
});
