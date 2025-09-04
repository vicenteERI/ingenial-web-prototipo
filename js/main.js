/* =========================================================
   INGENIAL.CL — main.js (v4.3)
   - Desktop: card más ancha (360px) + controles cómodos
   - Móvil: chat fullscreen (90% alto) con overlay y bloqueo de scroll
   - Toggle abrir/cerrar desde el FAB
   - Enlace universal wa.me
   - NAV moderno: sombra al scrollear + cierre en móvil
   - Scroll suave + scrollspy + reveal
   - 🔹 Nuevo: número de WhatsApp por cada opción rápida
========================================================= */

/* -----------------------------
   0) Configuración
------------------------------*/
/* Número principal (se usa para el mensaje libre del input) */
const MAIN_WA_PHONE = "56958810493"; // cámbialo por tu número (SIN +, con 56)

/* vh real en móviles (para 90% alto sin saltos en iOS) */
(function setRealVh() {
  const set = () =>
    document.documentElement.style.setProperty(
      "--vh",
      window.innerHeight * 0.01 + "px"
    );
  set();
  window.addEventListener("resize", set);
})();

/* Abrir WhatsApp (universal) */
function openWhatsApp(phone, message) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

/* -----------------------------
   1) Menú WhatsApp
------------------------------*/
/* 🔹 Cada opción ahora define su propio número `phone` */
const quickReplies = [
  {
    label: "Quiero una reunión",
    phone: "56911111112", // <-- reemplaza por el número del área/comercial
    msg: "Hola Ingenial, me gustaría agendar una reunión."
  },
  {
    label: "Servicios y precios",
    phone: "56922222222", // <-- reemplaza por el número del área/ventas
    msg: "Hola, ¿pueden enviarme info de servicios y tarifas?"
  },
  {
    label: "Casos de éxito",
    phone: "56933333333", // <-- reemplaza por el número del área/marketing
    msg: "Hola, quiero conocer sus casos de éxito y referencias."
  },
  {
    label: "Otro",
    phone: "56984395838", // <-- por defecto al principal
    msg: "Hola Ingenial, quisiera hacer una consulta."
  }
];

(function initWhatsAppMenu() {
  const waBtn =
    document.querySelector(".btn-whatsapp") ||
    document.getElementById("waFab") ||
    document.querySelector(
      'a[href*="wa.me"], a[href*="web.whatsapp.com"], a[href*="api.whatsapp.com"]'
    );

  if (!waBtn) return;

  let created = false;
  let isOpen = false;

  waBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!created) {
      createMenu();
      created = true;
    }
    toggleMenu(!isOpen);
  });

  function createMenu() {
    // Overlay
    const overlay = document.createElement("div");
    overlay.id = "waOverlay";
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(2,6,23,.45);
      z-index: 99990;
      opacity: 0; pointer-events: none;
      transition: opacity .2s ease;
      backdrop-filter: blur(2px);
    `;
    overlay.addEventListener("click", () => toggleMenu(false));

    // Contenedor
    const menu = document.createElement("div");
    menu.id = "waMenu";
    menu.style.cssText = `
      position: fixed;
      right: 20px; bottom: 90px;
      z-index: 99999;
      width: 360px;
      max-width: 92vw;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      box-shadow: 0 18px 40px rgba(2,6,23,.18);
      overflow: hidden;
      transform: translateY(8px);
      opacity: 0; pointer-events: none;
      transition: opacity .2s ease, transform .2s ease;
      max-height: min(560px, calc(100vh - 140px));
      display: flex; flex-direction: column;
    `;

    // Header
    const head = document.createElement("div");
    head.style.cssText = `
      display:flex; align-items:center; justify-content:space-between; gap:10px;
      padding:12px 14px; background:#25D366; color:#fff;
      font-weight:700; letter-spacing:.2px; flex:0 0 auto;
    `;
    head.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <i class="bi bi-whatsapp" style="font-size:20px;"></i>
        <span>Contactar por WhatsApp</span>
      </div>
      <button id="waClose" aria-label="Cerrar" style="
        background:rgba(255,255,255,.15); color:#fff; border:0;
        width:32px; height:32px; border-radius:8px; cursor:pointer; font-size:18px; line-height:0;
      ">✕</button>
    `;
    head.querySelector("#waClose").addEventListener("click", () => toggleMenu(false));

    // Lista de quick replies (cada una usa su propio número)
    const listWrap = document.createElement("div");
    listWrap.style.cssText = `
      padding:12px; gap:10px; display:flex; flex-direction:column;
      overflow:auto; flex:1 1 auto; scrollbar-width: thin;
    `;

    quickReplies.forEach((q) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = q.label;
      btn.style.cssText = `
        text-align:left; padding:12px 14px; border-radius:10px;
        border:1px solid #e5e7eb; background:#fff; cursor:pointer;
        font-weight:600; transition:all .15s ease; font-size:15px;
      `;
      btn.addEventListener("mouseover", () => (btn.style.borderColor = "#25D366"));
      btn.addEventListener("mouseout", () => (btn.style.borderColor = "#e5e7eb"));
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        openWhatsApp(q.phone, q.msg); // 🔹 usa el número propio de la opción
      });
      listWrap.appendChild(btn);
    });

    // Footer (input + enviar) → usa el número principal
    const footer = document.createElement("div");
    footer.style.cssText =
      "padding:12px 14px;display:flex;gap:10px;align-items:center;border-top:1px solid #f1f5f9;flex:0 0 auto;";

    const custom = document.createElement("input");
    custom.type = "text";
    custom.placeholder = "Escribe tu mensaje…";
    custom.style.cssText =
      "flex:1;padding:12px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;";

    const send = document.createElement("button");
    send.type = "button";
    send.textContent = "Enviar";
    send.style.cssText = `
      flex: 0 0 auto;
      padding: 12px 20px;
      border-radius: 8px;
      border: 0;
      background: #25D366;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      font-size: 15px;
    `;
    send.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const msg = custom.value.trim() || "Hola Ingenial, quisiera más información.";
      openWhatsApp(MAIN_WA_PHONE, msg); // 🔹 input libre va al número principal
    });

    footer.appendChild(custom);
    footer.appendChild(send);

    menu.appendChild(head);
    menu.appendChild(listWrap);
    menu.appendChild(footer);

    document.body.appendChild(overlay);
    document.body.appendChild(menu);

    // Adaptación móvil: chat fullscreen (100% ancho, 90% alto)
    const applyMobileLayout = () => {
      const isSmall = window.innerWidth <= 576;
      if (isSmall) {
        const vh = getComputedStyle(document.documentElement).getPropertyValue("--vh") || "1px";
        menu.style.width = "100vw";
        menu.style.left = "0";
        menu.style.right = "0";
        menu.style.bottom = "0";
        menu.style.borderRadius = "16px 16px 0 0";
        menu.style.maxHeight = `calc(${vh} * 90)`;
        menu.style.height = `calc(${vh} * 90)`;
        menu.style.transform = "translateY(8px)";
      } else {
        menu.style.width = "360px";
        menu.style.left = "auto";
        menu.style.right = "20px";
        menu.style.bottom = "90px";
        menu.style.borderRadius = "16px";
        menu.style.maxHeight = "min(560px, calc(100vh - 140px))";
        menu.style.height = "auto";
        menu.style.transform = "translateY(8px)";
      }
    };
    applyMobileLayout();
    window.addEventListener("resize", applyMobileLayout);

    // Cerrar fuera/ESC
    document.addEventListener("click", (ev) => {
      if (ev.target.id === "waOverlay") toggleMenu(false);
    });
    document.addEventListener("keydown", (ev) => ev.key === "Escape" && toggleMenu(false));
  }

  function toggleMenu(open) {
    const menu = document.getElementById("waMenu");
    const overlay = document.getElementById("waOverlay");
    if (!menu || !overlay) return;

    isOpen = !!open;
    if (isOpen) {
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
      menu.style.opacity = "1";
      menu.style.transform = "translateY(0)";
      menu.style.pointerEvents = "auto";
      document.body.style.overflow = "hidden"; // bloquear scroll del body
    } else {
      overlay.style.opacity = "0";
      overlay.style.pointerEvents = "none";
      menu.style.opacity = "0";
      menu.style.transform = "translateY(8px)";
      menu.style.pointerEvents = "none";
      document.body.style.overflow = ""; // habilitar scroll
    }
  }
})();

/* -----------------------------
   1.5) NAV moderno: estado scrolleado + cerrar menú móvil
------------------------------*/
(function navEnhancements(){
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  // sombra/compacto al hacer scroll
  const onScroll = () => {
    if (window.scrollY > 10) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // cerrar el menú en móvil al hacer click en un enlace
  const collapseEl = document.getElementById('mainNav');
  if (collapseEl) {
    collapseEl.querySelectorAll('a.nav-link').forEach(a=>{
      a.addEventListener('click', () => {
        if (window.bootstrap) {
          const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }
})();

/* -----------------------------
   2) Scroll suave
------------------------------*/
(function smoothScroll() {
  // enlaces del nav moderno
  const links = document.querySelectorAll('.site-nav .nav-link[href^="#"]');
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // altura aproximada del nav fijo
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

/* -----------------------------
   3) ScrollSpy simple
------------------------------*/
(function navActiveOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".site-nav .nav-link");
  const spy = () => {
    let current = "";
    sections.forEach((sec) => {
      const top = window.scrollY;
      const offset = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (top >= offset && top < offset + height) current = `#${sec.id}`;
    });
    navLinks.forEach((a) => {
      if (a.getAttribute("href") === current) a.classList.add("active");
      else a.classList.remove("active");
    });
  };
  window.addEventListener("scroll", spy, { passive: true });
  spy();
})();

/* -----------------------------
   4) Reveal on view
------------------------------*/
(function revealOnView() {
  const els = document.querySelectorAll(".cardx, .service, .project, .feature-card, .offer-card");
  if (!("IntersectionObserver" in window) || els.length === 0) return;

  els.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity .4s ease, transform .4s ease";
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  els.forEach((el) => io.observe(el));
})();
