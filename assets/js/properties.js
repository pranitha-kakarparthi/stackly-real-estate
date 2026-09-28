/* ==========================================================================
   STACKLY REAL ESTATE - PROPERTIES & MORTGAGE CONTROLLER (properties.js)
   Live Filtering, Quick-View Modal, Dynamic Card Rendering, EMI Calculator
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPropertyExplorer();
  initMortgageCalculator();
  initHeroSearchForm();
});

/* ==========================================================================
   1. PROPERTY EXPLORER (Live Search, Filter, Sort, Render)
   ========================================================================== */
function initPropertyExplorer() {
  const gridContainer = document.getElementById("properties-grid");
  if (!gridContainer) return;

  const searchInput = document.getElementById("filter-keyword");
  const typeSelect = document.getElementById("filter-type");
  const statusSelect = document.getElementById("filter-status");
  const citySelect = document.getElementById("filter-city");
  const sortSelect = document.getElementById("filter-sort");
  const resultCountEl = document.getElementById("properties-count");
  const resetBtn = document.getElementById("filter-reset-btn");

  // Check URL params (e.g. from Hero search)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("keyword") && searchInput)
    searchInput.value = urlParams.get("keyword");
  if (urlParams.get("type") && typeSelect)
    typeSelect.value = urlParams.get("type");
  if (urlParams.get("status") && statusSelect)
    statusSelect.value = urlParams.get("status");
  if (urlParams.get("city") && citySelect)
    citySelect.value = urlParams.get("city");

  const render = () => {
    const allProps = window.StacklyStore.getProperties();
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const type = typeSelect ? typeSelect.value : "all";
    const status = statusSelect ? statusSelect.value : "all";
    const city = citySelect ? citySelect.value : "all";
    const sort = sortSelect ? sortSelect.value : "featured";

    let filtered = allProps.filter((p) => {
      const matchKeyword =
        !keyword ||
        p.title.toLowerCase().includes(keyword) ||
        p.address.toLowerCase().includes(keyword) ||
        p.city.toLowerCase().includes(keyword);

      const matchType =
        type === "all" || p.type.toLowerCase() === type.toLowerCase();
      const matchStatus =
        status === "all" || p.status.toLowerCase() === status.toLowerCase();
      const matchCity =
        city === "all" || p.city.toLowerCase() === city.toLowerCase();

      return matchKeyword && matchType && matchStatus && matchCity;
    });

    // Sorting
    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "beds-desc") {
      filtered.sort((a, b) => b.beds - a.beds);
    } else {
      // Featured first
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    if (resultCountEl) {
      resultCountEl.textContent = `Showing ${filtered.length} of ${allProps.length} properties`;
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🏡</div>
          <h3 style="color: var(--color-dark); margin-bottom: 0.5rem;">No properties found</h3>
          <p style="color: var(--color-text-muted); margin-bottom: 1.5rem;">Try adjusting your search criteria or clearing filters.</p>
          <button id="clear-filters-empty" class="btn btn-primary btn-sm">Clear All Filters</button>
        </div>
      `;
      const clearEmptyBtn = document.getElementById("clear-filters-empty");
      if (clearEmptyBtn) clearEmptyBtn.addEventListener("click", resetFilters);
      return;
    }

    const favs = window.StacklyStore.getFavorites();

    gridContainer.innerHTML = filtered
      .map(
        (p) => `
      <article class="property-card" data-id="${p.id}">
        <div class="property-thumb-wrap">
          <img src="${p.image}" alt="${p.title}" class="property-thumb" loading="lazy" width="600" height="400">
          <div class="property-badge-group">
            <span class="badge ${p.status === "sale" ? "badge-sale" : "badge-rent"}">For ${p.status}</span>
            ${p.featured ? '<span class="badge badge-featured">Featured</span>' : ""}
          </div>
          <div class="property-price-tag">${p.priceDisplay}</div>
          <button class="property-fav-btn ${favs.includes(p.id) ? "active" : ""}" data-fav="${p.id}" aria-label="Save Property">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${favs.includes(p.id) ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="property-body">
          <div class="property-type">${p.type}</div>
          <h3 class="property-title">
            <a href="javascript:void(0)" class="quick-view-trigger" data-id="${p.id}">${p.title}</a>
          </h3>
          <div class="property-location">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${p.address}, ${p.city}</span>
          </div>
          <div class="property-specs">
            <div class="spec-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
              <span><strong>${p.beds}</strong> Beds</span>
            </div>
            <div class="spec-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6h6M7 10h10M4 14h16M4 18h16M7 6v12M17 6v12"/></svg>
              <span><strong>${p.baths}</strong> Baths</span>
            </div>
            <div class="spec-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM9 3v18M3 9h18"/></svg>
              <span><strong>${p.sqft}</strong> sqft</span>
            </div>
          </div>
          <div class="property-footer">
            <div class="property-agent">
              <img src="${p.agent.avatar}" alt="${p.agent.name}" class="agent-thumb" width="34" height="34">
              <span class="agent-name">${p.agent.name}</span>
            </div>
            <button class="property-view-btn quick-view-trigger" data-id="${p.id}">
              <span>Details</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    // Reattach listeners
    gridContainer.querySelectorAll(".property-fav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-fav");
        const isFav = window.StacklyStore.toggleFavorite(id);
        btn.classList.toggle("active", isFav);
        const svg = btn.querySelector("svg");
        if (svg) svg.setAttribute("fill", isFav ? "currentColor" : "none");
        window.showToast(
          isFav
            ? "Added to your saved properties!"
            : "Removed from saved properties."
        );
      });
    });

    gridContainer.querySelectorAll(".quick-view-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const id = trigger.getAttribute("data-id");
        openQuickViewModal(id);
      });
    });
  };

  const resetFilters = () => {
    if (searchInput) searchInput.value = "";
    if (typeSelect) typeSelect.value = "all";
    if (statusSelect) statusSelect.value = "all";
    if (citySelect) citySelect.value = "all";
    if (sortSelect) sortSelect.value = "featured";
    render();
  };

  if (searchInput) searchInput.addEventListener("input", render);
  if (typeSelect) typeSelect.addEventListener("change", render);
  if (statusSelect) statusSelect.addEventListener("change", render);
  if (citySelect) citySelect.addEventListener("change", render);
  if (sortSelect) sortSelect.addEventListener("change", render);
  if (resetBtn) resetBtn.addEventListener("click", resetFilters);

  // Initial render
  render();
}

/* ==========================================================================
   2. QUICK VIEW MODAL
   ========================================================================== */
function openQuickViewModal(propId) {
  const props = window.StacklyStore.getProperties();
  const p = props.find((item) => item.id === propId);
  if (!p) return;

  let modalOverlay = document.getElementById("property-quick-modal");
  if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.id = "property-quick-modal";
    modalOverlay.className = "modal-overlay";
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-prop-title">
      <button class="modal-close-btn" aria-label="Close modal">✕</button>
      <div style="position: relative; height: 320px; overflow: hidden; background: #000;">
        <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;">
        <div class="property-badge-group">
          <span class="badge ${p.status === "sale" ? "badge-sale" : "badge-rent"}">For ${p.status}</span>
          ${p.featured ? '<span class="badge badge-featured">Featured</span>' : ""}
        </div>
        <div class="property-price-tag">${p.priceDisplay}</div>
      </div>
      <div style="padding: 2rem;">
        <div class="property-type">${p.type} • ${p.city}</div>
        <h2 id="modal-prop-title" style="font-size: 1.6rem; font-weight: 700; color: var(--color-dark); margin: 0.25rem 0 0.75rem 0;">${p.title}</h2>
        <div class="property-location" style="margin-bottom: 1.5rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${p.address}, ${p.city}</span>
        </div>
        <div class="property-specs" style="margin-bottom: 1.5rem;">
          <div class="spec-item"><span><strong>${p.beds}</strong> Bedrooms</span></div>
          <div class="spec-item"><span><strong>${p.baths}</strong> Bathrooms</span></div>
          <div class="spec-item"><span><strong>${p.sqft}</strong> sqft Area</span></div>
          <div class="spec-item"><span><strong>${p.garage}</strong> Garage</span></div>
        </div>
        <p style="color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.75rem;">${p.description}</p>
        
        <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--color-dark); margin-bottom: 0.75rem;">Premium Amenities</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
          ${p.amenities.map((a) => `<span style="background: var(--color-bg-light); border: 1px solid var(--color-border); padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 0.8125rem; font-weight: 500;">✓ ${a}</span>`).join("")}
        </div>

        <div style="background: var(--color-bg-light); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <img src="${p.agent.avatar}" alt="${p.agent.name}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary);">
            <div>
              <h5 style="font-weight: 700; color: var(--color-dark); font-size: 0.95rem;">${p.agent.name}</h5>
              <p style="color: var(--color-text-muted); font-size: 0.8125rem;">${p.agent.role}</p>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <a href="tel:${p.agent.phone}" class="btn btn-outline btn-sm">Call Agent</a>
            <a href="contact.html?property=${encodeURIComponent(p.title)}" class="btn btn-primary btn-sm">Schedule Visit</a>
          </div>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add("open");

  const closeBtn = modalOverlay.querySelector(".modal-close-btn");
  const closeModal = () => modalOverlay.classList.remove("open");
  closeBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

/* ==========================================================================
   3. MORTGAGE EMI CALCULATOR
   ========================================================================== */
function initMortgageCalculator() {
  const priceSlider = document.getElementById("calc-price");
  const downSlider = document.getElementById("calc-down");
  const rateSlider = document.getElementById("calc-rate");
  const termSlider = document.getElementById("calc-term");

  if (!priceSlider || !downSlider || !rateSlider || !termSlider) return;

  const priceVal = document.getElementById("calc-price-val");
  const downVal = document.getElementById("calc-down-val");
  const rateVal = document.getElementById("calc-rate-val");
  const termVal = document.getElementById("calc-term-val");

  const emiDisplay = document.getElementById("calc-monthly-emi");
  const totalLoanDisplay = document.getElementById("calc-total-loan");
  const totalInterestDisplay = document.getElementById("calc-total-interest");

  const calculate = () => {
    const P_total = parseFloat(priceSlider.value);
    const downPercent = parseFloat(downSlider.value);
    const annualRate = parseFloat(rateSlider.value);
    const tenureYears = parseFloat(termSlider.value);

    const downPayment = (P_total * downPercent) / 100;
    const loanAmount = P_total - downPayment;
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    // EMI formula: [P * r * (1+r)^n] / [(1+r)^n - 1]
    let monthlyEmi = 0;
    if (monthlyRate > 0) {
      monthlyEmi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyEmi = loanAmount / totalMonths;
    }

    const totalRepay = monthlyEmi * totalMonths;
    const totalInterest = totalRepay - loanAmount;

    // Format currency in Lakhs / Crores / Thousands
    const formatINR = (num) => "₹" + Math.round(num).toLocaleString("en-IN");

    if (priceVal) priceVal.textContent = formatINR(P_total);
    if (downVal)
      downVal.textContent = `${downPercent}% (${formatINR(downPayment)})`;
    if (rateVal) rateVal.textContent = `${annualRate}%`;
    if (termVal) termVal.textContent = `${tenureYears} Years`;

    if (emiDisplay) emiDisplay.textContent = formatINR(monthlyEmi) + " / mo";
    if (totalLoanDisplay) totalLoanDisplay.textContent = formatINR(loanAmount);
    if (totalInterestDisplay)
      totalInterestDisplay.textContent = formatINR(totalInterest);
  };

  priceSlider.addEventListener("input", calculate);
  downSlider.addEventListener("input", calculate);
  rateSlider.addEventListener("input", calculate);
  termSlider.addEventListener("input", calculate);

  calculate();
}

/* ==========================================================================
   4. HERO SEARCH FORM CONTROLLER (Redirects to properties.html with params)
   ========================================================================== */
function initHeroSearchForm() {
  const heroForm = document.getElementById("hero-search-form");
  if (!heroForm) return;

  const tabs = heroForm.querySelectorAll(".search-tab-btn");
  let selectedStatus = "sale";

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      selectedStatus = tab.getAttribute("data-status") || "sale";
    });
  });

  heroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = heroForm.querySelector('[name="keyword"]')?.value || "";
    const type = heroForm.querySelector('[name="type"]')?.value || "all";
    const city = heroForm.querySelector('[name="city"]')?.value || "all";

    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (type !== "all") params.set("type", type);
    if (city !== "all") params.set("city", city);
    if (selectedStatus !== "all") params.set("status", selectedStatus);

    window.location.href = `properties.html?${params.toString()}`;
  });
}
