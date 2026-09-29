/* ==========================================================================
   STACKLY REAL ESTATE - MAIN JAVASCRIPT (main.js)
   Global: Loader, Sticky Nav, Mobile Menu, Toasts, Universal 404 Interceptor
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initStickyHeader();
  initNavigationHighlight();
  initMobileDrawer();
  initAccordion();
  initSmoothAnimations();
  initPricingBillingToggle();
  initSavedProperties();
});

/* ==========================================================================
   1. LOADER INITIALIZATION
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById("stackly-loader");
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 450);
  };

  if (document.readyState === "complete") {
    setTimeout(hideLoader, 200);
  } else {
    window.addEventListener("load", hideLoader);
    setTimeout(hideLoader, 900); // Safety fallback
  }
}

/* ==========================================================================
   2. DYNAMIC TIME-AWARE GREETING (For Dashboard)
   ========================================================================== */
function getGreetingByTime() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

/* ==========================================================================
   3. STICKY HEADER BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector(".main-header");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   4. NAVIGATION HIGHLIGHTING
   ========================================================================== */
function initNavigationHighlight() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll(
    ".nav-link, .dropdown-link, .mobile-nav-link"
  );

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || href.startsWith("javascript:")) return;

    const targetFile = href.split("?")[0].split("/").pop().toLowerCase();
    const currentFile =
      currentPath.split("/").pop().toLowerCase() || "index.html";

    if (
      currentFile === targetFile ||
      (currentFile === "" && targetFile === "index.html")
    ) {
      link.classList.add("active");
      const parentNavItem = link.closest(".nav-item");
      if (parentNavItem) {
        const parentLink = parentNavItem.querySelector(".nav-link");
        if (parentLink) parentLink.classList.add("active");
      }
    }
  });
}

/* ==========================================================================
   5. MOBILE FULL-SCREEN DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const drawer = document.querySelector(".mobile-nav-drawer");
  const closeBtn = document.querySelector(".mobile-close-btn");

  if (!hamburgerBtn || !drawer) return;

  const openDrawer = () => {
    hamburgerBtn.classList.add("is-active");
    drawer.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    hamburgerBtn.classList.remove("is-active");
    drawer.classList.remove("open");
    document.body.style.overflow = "";
  };

  hamburgerBtn.addEventListener("click", () => {
    if (drawer.classList.contains("open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  // Close drawer on standard link click (except dropdown toggle)
  const drawerLinks = drawer.querySelectorAll(
    ".mobile-nav-link, .mobile-sub-link, .mobile-drawer-footer a"
  );
  drawerLinks.forEach((a) => {
    // If it's the header of a group, only close if clicking directly without toggling submenu
    a.addEventListener("click", (e) => {
      const parentGroup = a.closest(".mobile-nav-group");
      if (parentGroup && a.classList.contains("mobile-nav-link")) {
        const toggleBtn = parentGroup.querySelector(".mobile-dropdown-btn");
        const submenu = parentGroup.querySelector(".mobile-submenu");
        // If submenu is closed and user taps Properties, open submenu instead of navigating away immediately
        if (toggleBtn && (!submenu || !submenu.classList.contains("open"))) {
          e.preventDefault();
          toggleBtn.click();
          return;
        }
      }
      closeDrawer();
    });
  });

  // Mobile submenu accordion toggling
  const dropdownToggles = drawer.querySelectorAll(".mobile-dropdown-btn");
  dropdownToggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentGroup = btn.closest(".mobile-nav-group");
      if (!parentGroup) return;
      const submenu = parentGroup.querySelector(".mobile-submenu");
      const isExpanded = btn.classList.toggle("active");
      btn.setAttribute("aria-expanded", isExpanded);
      if (submenu) {
        submenu.classList.toggle("open", isExpanded);
      }
    });
  });

  // Tablet & Touch Screen Dropdown Support for Desktop Nav
  const desktopNavItems = document.querySelectorAll(".desktop-nav .nav-item");
  desktopNavItems.forEach((item) => {
    if (item.querySelector(".nav-dropdown")) {
      const mainLink = item.querySelector(".nav-link");
      if (mainLink) {
        mainLink.addEventListener("click", (e) => {
          if (
            window.innerWidth <= 1100 &&
            !item.classList.contains("active-dropdown")
          ) {
            e.preventDefault();
            desktopNavItems.forEach(
              (other) =>
                other !== item && other.classList.remove("active-dropdown")
            );
            item.classList.add("active-dropdown");
          }
        });
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-item")) {
      desktopNavItems.forEach((item) =>
        item.classList.remove("active-dropdown")
      );
    }
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      const parentAccordion = item.closest(".faq-accordion");
      if (parentAccordion) {
        parentAccordion.querySelectorAll(".faq-item").forEach((other) => {
          if (other !== item) other.classList.remove("active");
        });
      }
      item.classList.toggle("active", !isActive);
    });
  });
}

/* ==========================================================================
   7. GLOBAL TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `stackly-toast ${type}`;

  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  toast.innerHTML = `<strong>${icon}</strong> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

window.showToast = showToast;
window.getGreetingByTime = getGreetingByTime;

/* ==========================================================================
   8. SMOOTH SCROLL SCALE & REVEAL ANIMATIONS (Inspiration: vigneshwaran2026)
   ========================================================================== */
function initSmoothAnimations() {
  const animElements = document.querySelectorAll(
    ".animate-scale, .reveal-fade-up, .feature-card, .prop-card, .service-card, .kpi-card, .about-card"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    animElements.forEach((el) => {
      if (
        !el.classList.contains("animate-scale") &&
        !el.classList.contains("reveal-fade-up")
      ) {
        el.classList.add("animate-scale");
      }
      observer.observe(el);
    });
  } else {
    animElements.forEach((el) => el.classList.add("show"));
  }

  // Dynamic Tagline Rotator
  const textRotator = document.querySelector(".changing-text-rotator");
  if (textRotator) {
    const words = [
      "Reliable Construction",
      "Smart Luxury Investment",
      "Modern Salem Living",
      "Institutional Advisory",
      "RERA Clear-Title Assets",
    ];
    let wordIndex = 0;
    setInterval(() => {
      textRotator.classList.add("fade-out");
      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        textRotator.textContent = words[wordIndex];
        textRotator.classList.remove("fade-out");
        textRotator.classList.add("fade-in");
      }, 350);
    }, 3200);
  }
}

/* ==========================================================================
   9. PRICING BILLING SWITCH TOGGLE (Monthly / Annual)
   ========================================================================== */
function initPricingBillingToggle() {
  const toggle = document.getElementById("billing-toggle");
  if (!toggle) return;

  const knob = document.getElementById("billing-toggle-knob");
  const monthlyLabel = document.getElementById("billing-monthly-label");
  const annualLabel = document.getElementById("billing-annual-label");

  const pricePro = document.getElementById("price-pro");
  const notePro = document.getElementById("note-pro");
  const priceEnterprise = document.getElementById("price-enterprise");
  const noteEnterprise = document.getElementById("note-enterprise");

  // Initial state: true = Annual
  let isAnnual = true;

  const updateUI = () => {
    if (isAnnual) {
      if (knob) knob.style.left = "27px";
      if (toggle) {
        toggle.style.background = "var(--color-primary)";
        toggle.setAttribute("aria-checked", "true");
      }
      if (monthlyLabel) {
        monthlyLabel.style.color = "var(--color-text-muted)";
        monthlyLabel.style.fontWeight = "500";
      }
      if (annualLabel) {
        annualLabel.style.color = "var(--color-dark)";
        annualLabel.style.fontWeight = "700";
      }
      if (pricePro) {
        pricePro.innerHTML = `₹1,599 <span style="font-size: 1rem; color: var(--color-text-muted); font-weight: 500;">/ month</span>`;
      }
      if (notePro) {
        notePro.innerHTML = `₹19,188 billed annually (Save 20%)`;
        notePro.style.color = "#557800";
      }
      if (priceEnterprise) {
        priceEnterprise.innerHTML = `₹6,399 <span style="font-size: 1rem; color: var(--color-text-muted); font-weight: 500;">/ month</span>`;
      }
      if (noteEnterprise) {
        noteEnterprise.innerHTML = `₹76,788 billed annually (Save 20%)`;
        noteEnterprise.style.color = "#557800";
      }
    } else {
      if (knob) knob.style.left = "3px";
      if (toggle) {
        toggle.style.background = "#94a3b8";
        toggle.setAttribute("aria-checked", "false");
      }
      if (monthlyLabel) {
        monthlyLabel.style.color = "var(--color-dark)";
        monthlyLabel.style.fontWeight = "700";
      }
      if (annualLabel) {
        annualLabel.style.color = "var(--color-text-muted)";
        annualLabel.style.fontWeight = "500";
      }
      if (pricePro) {
        pricePro.innerHTML = `₹1,999 <span style="font-size: 1rem; color: var(--color-text-muted); font-weight: 500;">/ month</span>`;
      }
      if (notePro) {
        notePro.innerHTML = `Billed monthly, cancel anytime`;
        notePro.style.color = "var(--color-text-muted)";
      }
      if (priceEnterprise) {
        priceEnterprise.innerHTML = `₹7,999 <span style="font-size: 1rem; color: var(--color-text-muted); font-weight: 500;">/ month</span>`;
      }
      if (noteEnterprise) {
        noteEnterprise.innerHTML = `Billed monthly, for up to 10 agents`;
        noteEnterprise.style.color = "var(--color-text-muted)";
      }
    }
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isAnnual = !isAnnual;
    updateUI();
  });

  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      isAnnual = !isAnnual;
      updateUI();
    }
  });

  if (monthlyLabel) {
    monthlyLabel.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isAnnual) {
        isAnnual = false;
        updateUI();
      }
    });
  }

  if (annualLabel) {
    annualLabel.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isAnnual) {
        isAnnual = true;
        updateUI();
      }
    });
  }

  updateUI();
}

/* ==========================================================================
   10. SAVED PROPERTIES / FAVORITES TOGGLE
   Condition: "Saved properties behaviour should work similar to properties page
   in home page also to save the property with notification."
   ========================================================================== */
function initSavedProperties() {
  const favBtns = document.querySelectorAll(".property-fav-btn[data-fav]");
  if (!favBtns.length) return;

  const updateUI = () => {
    if (!window.StacklyStore) return;
    const favs = window.StacklyStore.getFavorites() || [];
    favBtns.forEach((btn) => {
      const id = btn.getAttribute("data-fav");
      const isFav = favs.includes(id);
      btn.classList.toggle("active", isFav);
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", isFav ? "currentColor" : "none");
    });
  };

  favBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-fav");
      if (!window.StacklyStore) return;
      const isFav = window.StacklyStore.toggleFavorite(id);
      btn.classList.toggle("active", isFav);
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", isFav ? "currentColor" : "none");
      if (window.showToast) {
        window.showToast(
          isFav
            ? "Added to your saved properties!"
            : "Removed from saved properties.",
          "info"
        );
      }
    });
  });

  updateUI();
}
