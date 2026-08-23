(() => {
  document.head.insertAdjacentHTML(
    "beforeend",
    '<link rel="stylesheet" href="enhancements.css"><link rel="stylesheet" href="button-spacing.css"><link rel="stylesheet" href="light-mode-text.css">',
  );
  const page = location.pathname.split("/").pop() || "index.html",
    nav = document.querySelector(".nav-inner");
  if (page === "index.html") {
    const savedTarget = sessionStorage.getItem("home-return-target");
    if (savedTarget) {
      sessionStorage.removeItem("home-return-target");
      const restoreHomeSection = () =>
        setTimeout(
          () => document.querySelector(savedTarget)?.scrollIntoView(),
          0,
        );
      if (document.readyState === "complete") restoreHomeSection();
      else window.addEventListener("load", restoreHomeSection, { once: true });
    }
  }
  if (nav)
    nav.innerHTML = `<a class="brand" href="index.html" aria-label="Nouryn Eryssa home"><span class="brand-mark"><img src="assets/logo-transparent.png" alt="" aria-hidden="true"></span>Nouryn <span>Eryssa</span></a><nav class="links">${[
      ["index.html", "Home"],
      ["about.html", "About"],
      ["experience.html", "Experience"],
      ["achievements.html", "Achievements"],
      ["events.html", "Events"],
      ["contact.html", "Contact"],
    ]
      .map(
        ([u, n]) =>
          `<a class="${page === u ? "active" : ""}" href="${u}">${n}</a>`,
      )
      .join(
        "",
      )}</nav><button class="theme-toggle" data-theme-toggle type="button" aria-label="Switch to light mode" title="Switch to light mode"><span aria-hidden="true">☼</span></button>`;
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
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const brandLogo = document.querySelector(".brand-mark img");
  const set = (t) => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem("portfolio-theme", t);
    if (brandLogo)
      brandLogo.src =
        t === "dark" ? "assets/logo-light.png" : "assets/logo-transparent.png";
    if (themeToggle) {
      const isLight = t === "light";
      themeToggle.innerHTML = `<span aria-hidden="true">${isLight ? "☾" : "☼"}</span>`;
      themeToggle.setAttribute(
        "aria-label",
        `Switch to ${isLight ? "dark" : "light"} mode`,
      );
      themeToggle.title = `Switch to ${isLight ? "dark" : "light"} mode`;
    }
  };
  set(
    localStorage.getItem("portfolio-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"),
  );
  document.addEventListener("click", (e) => {
    const returnTarget = e.target.closest("[data-return-target]");
    if (returnTarget)
      sessionStorage.setItem(
        "home-return-target",
        returnTarget.dataset.returnTarget,
      );
    const backHome = e.target.closest("[data-back-home]");
    if (backHome) {
      e.preventDefault();
      location.href = "index.html";
      return;
    }
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
    if (
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      a.length > 1
    ) {
      setInterval(() => show(i + 1), 5000);
    }
  });
  document.querySelectorAll(".skill-marquee-track").forEach((track) => {
    const sourceSet = track.querySelector(".skill-marquee-set");
    const fillTrack = () => {
      if (!sourceSet?.offsetWidth) return;
      let requiredSets = Math.max(
        2,
        Math.ceil(
          (track.parentElement.clientWidth * 2) / sourceSet.offsetWidth,
        ),
      );
      if (requiredSets % 2) requiredSets += 1;
      while (track.children.length < requiredSets) {
        const loopSet = sourceSet.cloneNode(true);
        loopSet.setAttribute("aria-hidden", "true");
        track.append(loopSet);
      }
      track.style.animationDuration = `${(track.scrollWidth / 2 / 28).toFixed(2)}s`;
    };
    fillTrack();
    window.addEventListener("load", fillTrack, { once: true });
    window.addEventListener("resize", fillTrack);
  });
  document
    .querySelector("[data-top]")
    ?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
})();
