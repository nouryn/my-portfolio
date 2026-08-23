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
      ["experience.html", "Experience"],
      ["projects.html", "Projects"],
      ["achievements.html", "Achievements"],
      ["events.html", "Events"],
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
      )}</nav><button class="theme-toggle" data-theme-toggle>☾ Dark</button>`;
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
  document.addEventListener("click", (e) => {
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
