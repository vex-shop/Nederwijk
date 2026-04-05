const pathLower = window.location.pathname.toLowerCase();

// 🔧 Normaliseer pad (verwijder trailing slash behalve root)
const path = pathLower !== "/" ? pathLower.replace(/\/$/, "") : "/";

// ── Page detection (GEFIXT) ──
const isHomePage =
  path === "/" ||
  path.endsWith("/index.html");

const isRulesPage =
  path === "/apv" ||
  path.endsWith("/apv") ||
  path.includes("regels.html");

const isSolliciterenPage =
  path === "/solliciteren" ||
  path.startsWith("/solliciteren") ||
  path.includes("solliciteren.html") ||
  path.includes("staff-sollicitatie.html");

// ── Subpage detectie ──
const isSubPage =
  path.includes("/pages/") ||
  isRulesPage ||
  isSolliciterenPage;

// ── Paths ──
const basePath = isSubPage ? "../" : "";

// 🔥 FIX: correcte links overal
const homeAnchor = isSubPage ? "../" : "/";
const regelsHref = basePath + "apv";
const applyAnchor = basePath + "solliciteren";
const donateAnchor = "https://Nederwijk.tebex.io/";
const logoSrc = basePath + "assets/images/ehlogo.png";

// ── Navbar ──
const navbarMarkup = `
  <section class="promo-bar">
    <div class="promo-track">
<div class="promo-items">
  <span class="promo-item">🚀 NEDERWIJK ROLEPLAY IS BEINA OPEN!</span>
  <span class="promo-item">🔥 NIEUWE SERVER • NIEUWE START</span>
  <span class="promo-item">🎁 GRATIS START BONUSSEN</span>
  <span class="promo-item">💎 PREMIUM RP ERVARING</span>
  <span class="promo-item">👑 WORD EEN VAN DE EERSTE SPELERS</span>
</div>
<div class="promo-items">
  <span class="promo-item">🚀 NEDERWIJK ROLEPLAY BEINA NU OPEN!</span>
  <span class="promo-item">🔥 NIEUWE SERVER • NIEUWE START</span>
  <span class="promo-item">🎁 GRATIS START BONUSSEN</span>
  <span class="promo-item">💎 PREMIUM RP ERVARING</span>
  <span class="promo-item">👑 WORD EEN VAN DE EERSTE SPELERS</span>
</div>
    </div>
  </section>

  <header class="site-header">
    <nav class="navbar">
      <a class="logo" href="${homeAnchor}">
        <img src="${logoSrc}" alt="Nederwijk Roleplay">
        <span>Nederwijk Roleplay</span>
      </a>

      <div class="nav-links">
        <a class="${isHomePage ? "active" : ""}" href="${homeAnchor}">Home</a>
        <a class="${isRulesPage ? "active" : ""}" href="${regelsHref}">APV</a>
        <a href="${donateAnchor}" target="_blank">Doneren</a>
        <a class="${isSolliciterenPage ? "active" : ""}" href="${applyAnchor}">Solliciteren</a>
        <a href="https://discord.gg/Nederwijkrp" target="_blank">Discord</a>
      </div>

      <button class="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>
    </nav>
  </header>
`;

document.body.insertAdjacentHTML("afterbegin", navbarMarkup);

// ── Mobile menu ──
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (toggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Sluit bij klik op link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Sluit bij klik buiten menu
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Sluit met ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

// ── Video autoplay fix ──
(function () {
  const video = document.querySelector(".hero-video");
  if (!video) return;

  video.play().catch(() => {
    document.addEventListener("click", () => video.play(), {
      once: true,
      passive: true,
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      video.play().catch(() => {});
    }
  });
})();

// ── Pause animaties bij tab switch ──
(function () {
  const promoTrack = document.querySelector(".promo-track");
  if (!promoTrack) return;

  document.addEventListener("visibilitychange", () => {
    promoTrack.style.animationPlayState =
      document.hidden ? "paused" : "running";
  });
})();

// ── Collapsible sections ──
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".article-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const content = toggle.nextElementSibling;
      if (!content) return;

      toggle.classList.toggle("collapsed");
      content.classList.toggle("collapsed");
    });
  });
});

// ── Prefetch links ──
(function () {
  const prefetched = new Set();

  document.addEventListener("pointerover", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("http") ||
      prefetched.has(href)
    )
      return;

    prefetched.add(href);

    const l = document.createElement("link");
    l.rel = "prefetch";
    l.href = href;
    document.head.appendChild(l);
  });
})();

// ── Player count ──
(function () {
  const API_URL =
    "https://servers-frontend.fivem.net/api/servers/single/bok8bd";

  async function update() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();

      const data = await res.json();
      const online = data?.Data?.clients ?? 0;
      const max = data?.Data?.sv_maxclients ?? 512;

      document.querySelectorAll(".online-count").forEach((el) => {
        el.textContent = `${online}/${max}`;
      });
    } catch {
      console.warn("Player count ophalen mislukt");
    }
  }

  update();
  setInterval(update, 60000);
})();
