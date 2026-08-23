(() => {
  document.head.insertAdjacentHTML(
    "beforeend",
    '<link rel="stylesheet" href="enhancements.css"><link rel="stylesheet" href="button-spacing.css"><link rel="stylesheet" href="light-mode-text.css">',
  );
  const page = location.pathname.split("/").pop() || "index.html",
    nav = document.querySelector(".nav-inner");
  if (nav)
    nav.innerHTML = `<a class="brand" href="index.html"><img src="assets/logo-transparent.png" alt="Nouryn Eryssa logo">Nouryn <span>Eryssa</span></a><nav class="links">${[
      ["index.html", "Home"],
      ["about.html", "About"],
      ["projects.html", "Projects"],
      ["skills.html", "Skills"],
      ["certifications.html", "Certifications"],
      ["contact.html", "Contact"],
    ]
      .map(
        ([u, n]) =>
          `<a class="${page === u ? "active" : ""}" href="${u}">${n}</a>`,
      )
      .join(
        "",
      )}</nav><button class="menu-toggle" data-menu-toggle type="button" aria-label="Open navigation menu" aria-expanded="false" title="Open navigation menu"><span></span><span></span><span></span></button><button class="theme-toggle" data-theme-toggle type="button" aria-label="Switch to light mode" title="Switch to light mode">☾ Dark</button>`;
  document.querySelectorAll("[data-page-include]").forEach(async (target) => {
    try {
      const response = await fetch(target.dataset.pageInclude);
      if (!response.ok)
        throw new Error(`Unable to load ${target.dataset.pageInclude}`);
      const pageDocument = new DOMParser().parseFromString(
        await response.text(),
        "text/html",
      );
      pageDocument.querySelectorAll("head style").forEach((style) => {
        const embeddedStyle = document.createElement("style");
        embeddedStyle.textContent = style.textContent;
        document.head.append(embeddedStyle);
      });
      target.replaceChildren(...pageDocument.querySelector("main").children);
    } catch (error) {
      target.textContent = "This section could not be loaded.";
      console.error(error);
    }
  });
  const photos = [
    "professional-portrait.jpeg",
    "ifoa-event.jpeg",
    "certificate-portrait.jpeg",
    "uitm-campus.jpeg",
    "library-portrait.jpeg",
    "event-portrait.jpeg",
    "professional-phone-1.jpeg",
    "professional-phone-2.jpeg",
  ];
  document.querySelectorAll("img").forEach((img, i) => {
    if (
      img.src.includes("placeholder-photo.jpg") ||
      img.src.includes("portrait-1.jpeg") ||
      img.src.includes("portrait-2.jpeg")
    )
      img.src = `assets/personal/${photos[i % photos.length]}`;
  });
  const set = (t) => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem("portfolio-theme", t);
    document.querySelector("[data-theme-toggle]").textContent =
      t === "light" ? "☾ Dark" : "☀ Light";
  };
  set(localStorage.getItem("portfolio-theme") || "dark");
  const menuToggle = document.querySelector("[data-menu-toggle]"),
    links = document.querySelector(".links"),
    closeMenu = () => {
      links?.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.setAttribute("aria-label", "Open navigation menu");
      menuToggle?.setAttribute("title", "Open navigation menu");
    };
  menuToggle?.addEventListener("click", () => {
    const isOpen = links?.classList.toggle("is-open") ?? false;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
    menuToggle.setAttribute(
      "title",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest(".links a")) closeMenu();
    if (e.target.closest("[data-theme-toggle]"))
      set(
        document.documentElement.dataset.theme === "light" ? "dark" : "light",
      );
    const b = e.target.closest("[data-flip]");
    if (b) {
      const c = b.closest(".flip-card");
      c.classList.toggle("is-flipped");
      b.textContent = c.classList.contains("is-flipped")
        ? "← Back"
        : "View details →";
    }
    const x = e.target.closest(".bubble");
    if (x) {
      x.classList.remove("bounce");
      void x.offsetWidth;
      x.classList.add("bounce");
    }
  });
  document.querySelectorAll("[data-slideshow]").forEach((s) => {
    const a = [...s.querySelectorAll(".slide")];
    let i = 0;
    const show = (n) => {
      i = (n + a.length) % a.length;
      a.forEach((x, k) => x.classList.toggle("active", k === i));
    };
    s.querySelector("[data-next]")?.addEventListener("click", () =>
      show(i + 1),
    );
    s.querySelector("[data-prev]")?.addEventListener("click", () =>
      show(i - 1),
    );
    setInterval(() => show(i + 1), 5000);
  });
  document
    .querySelector("[data-top]")
    ?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
})();
