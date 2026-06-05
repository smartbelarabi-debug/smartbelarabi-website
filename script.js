const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const header = document.querySelector(".site-header");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = `SmartBelArabi contact: ${data.get("topic") || "رسالة جديدة"}`;
    const body = [
      `الاسم: ${data.get("name") || ""}`,
      `البريد: ${data.get("email") || ""}`,
      `النوع: ${data.get("topic") || ""}`,
      `الشركة أو القناة: ${data.get("company") || ""}`,
      "",
      "الرسالة:",
      data.get("message") || ""
    ].join("\n");

    window.location.href = `mailto:contact@smartbelarabi.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const glossaryGrid = document.querySelector("[data-glossary-grid]");
const glossarySearch = document.querySelector("[data-glossary-search]");
const glossaryFilters = document.querySelector("[data-glossary-filters]");
const glossaryCount = document.querySelector("[data-glossary-count]");

if (glossaryGrid && window.smartBelArabiGlossary) {
  const terms = window.smartBelArabiGlossary;
  let activeCategory = "all";
  let query = "";
  const categories = ["all", ...new Set(terms.map((term) => term.category))];

  const labels = {
    all: "كل المصطلحات"
  };

  const renderFilters = () => {
    glossaryFilters.innerHTML = categories.map((category) => {
      const isActive = category === activeCategory;
      return `<button class="filter-chip${isActive ? " is-active" : ""}" type="button" data-category="${category}" aria-pressed="${isActive}">${labels[category] || category}</button>`;
    }).join("");
  };

  const renderTerms = () => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = terms.filter((term) => {
      const matchesCategory = activeCategory === "all" || term.category === activeCategory;
      const searchable = `${term.ar} ${term.en} ${term.category} ${term.explanation}`.toLowerCase();
      return matchesCategory && searchable.includes(normalizedQuery);
    });

    glossaryCount.textContent = `${filtered.length} مصطلح`;

    const grouped = categories
      .filter((category) => category !== "all")
      .map((category) => ({
        category,
        terms: filtered.filter((term) => term.category === category)
      }))
      .filter((group) => group.terms.length);

    glossaryGrid.innerHTML = grouped.map((group) => `
      <section class="glossary-category" aria-labelledby="category-${group.category.replace(/\s+/g, "-")}">
        <h2 id="category-${group.category.replace(/\s+/g, "-")}">${group.category}</h2>
        <div class="glossary-grid">
          ${group.terms.map((term) => `
            <article class="glossary-card">
              <span class="tag">${term.category}</span>
              <h3>${term.ar}</h3>
              <p class="english-term" lang="en" dir="ltr">${term.en}</p>
              <p>${term.explanation}</p>
              <div class="term-example"><strong>مثال عملي:</strong> ${term.example}</div>
            </article>
          `).join("")}
        </div>
      </section>
    `).join("") || `<div class="wide-card"><h3>لا توجد نتائج</h3><p>جرّب البحث باسم عربي أو إنجليزي مختلف.</p></div>`;
  };

  renderFilters();
  renderTerms();

  glossarySearch.addEventListener("input", (event) => {
    query = event.target.value;
    renderTerms();
  });

  glossaryFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderTerms();
  });
}
