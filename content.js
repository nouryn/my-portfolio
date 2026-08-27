(() => {
  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    })[character]);
  const formatDate = (date) => date ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00`)) : "";
  const card = (item) => {
    const tags = (item.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean)
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const image = item.image_url ? `<img class="dynamic-card-image" src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" loading="lazy">` : "";
    const link = item.external_url || item.proof_url;
    const action = link ? `<a class="button project-card-link" href="${escapeHtml(link)}"${item.external_url ? ' target="_blank" rel="noreferrer"' : ""}>${item.external_url ? "View project ↗" : "View proof →"}</a>` : "";
    return `<article class="card dynamic-card">${image}${item.subtitle || item.item_date ? `<p class="kicker">${escapeHtml(item.subtitle || formatDate(item.item_date))}</p>` : ""}<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p>${tags}${action}</article>`;
  };
  document.querySelectorAll("[data-content-category]").forEach(async (target) => {
    const categories = target.dataset.contentCategory.split(",");
    const limit = target.dataset.contentLimit || 3;
    try {
      const results = await Promise.all(categories.map(async (category) => {
        const response = await fetch(`api/content.php?category=${encodeURIComponent(category)}&limit=${limit}`);
        if (!response.ok) throw new Error("Content unavailable");
        return (await response.json()).items;
      }));
      const items = results.flat().sort((a, b) => `${b.item_date || b.created_at}`.localeCompare(`${a.item_date || a.created_at}`)).slice(0, limit);
      if (items.length) target.innerHTML = items.map(card).join("");
    } catch (error) {
      console.warn(`Could not load ${categories.join(", ")}`, error);
    }
  });
})();
