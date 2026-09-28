/* ==========================================================================
   STACKLY REAL ESTATE - MAIN JAVASCRIPT
   Global: Loader, Dynamic Greetings, Sticky Nav, Mobile Menu, Toasts, 404 Interceptor
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initDynamicGreetings();
  initStickyHeader();
  initNavigationHighlight();
  initMobileDrawer();
  initAccordion();
  initNewsletterForms();
  initAction404Interceptors();
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
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 450);
  };

  // Dismiss immediately when ready, or fallback at 900ms
  if (document.readyState === "complete") {
    setTimeout(hideLoader, 200);
  } else {
    window.addEventListener("load", hideLoader);
    setTimeout(hideLoader, 900); // Safety fallback
  }
}

/* ==========================================================================
   2. DYNAMIC TIME-AWARE GREETINGS
   Requirements: "Whenever there is a greeting message displayed anywhere in
   the website use the relevant time zones and duration of the day"
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

function initDynamicGreetings() {
  const greeting = getGreetingByTime();
  const greetingEls = document.querySelectorAll(
    ".dynamic-greeting, [data-greeting]"
  );
  greetingEls.forEach((el) => {
    const customUser = el.getAttribute("data-user");
    if (customUser) {
      el.textContent = `${greeting}, ${customUser}!`;
    } else {
      el.textContent = `${greeting}! Welcome to Stackly`;
    }
  });
}

/* ==========================================================================
   3. STICKY HEADER BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector(".main-header");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
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
   Requirements: "Need to highlight nav item in the nav bar based on the current active page"
   ========================================================================== */
function initNavigationHighlight() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll(
    ".nav-link, .dropdown-link, .mobile-nav-link"
  );

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || href.startsWith("javascript:")) return;

    const targetFile = href.split("/").pop().toLowerCase();
    const currentFile =
      currentPath.split("/").pop().toLowerCase() || "index.html";

    if (
      currentFile === targetFile ||
      (currentFile === "" && targetFile === "index.html")
    ) {
      link.classList.add("active");
      // If inside dropdown, mark parent nav-link too
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

  // Close on mobile link click
  const drawerLinks = drawer.querySelectorAll("a");
  drawerLinks.forEach((a) => {
    a.addEventListener("click", closeDrawer);
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
      // Close other accordions in the same group
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
   7. NEWSLETTER FORMS
   ========================================================================== */
function initNewsletterForms() {
  const forms = document.querySelectorAll(".footer-newsletter-form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector(".newsletter-input");
      if (!input || !input.value.trim() || !input.value.includes("@")) {
        showToast("Please provide a valid email address.", "error");
        if (input) input.focus();
        return;
      }
      showToast(
        "Thank you! You have subscribed to Stackly Market Insights.",
        "success"
      );
      input.value = "";
    });
  });
}

/* ==========================================================================
   8. 404 INTERCEPTOR FOR DEMO ACTIONS / SOCIAL LINKS / POLICIES
   Requirements: "Every action button should be redirected to 404 page"
   Social sign-ins, terms, forgot password, unlinked action buttons -> 404.html
   ========================================================================== */
function initAction404Interceptors() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("a, button");
    if (!target) return;

    // Check if element has action-404 class or points explicitly to /terms or /newsletter-policy or #
    const href = target.getAttribute("href");
    const isAction404 =
      target.classList.contains("action-404") ||
      target.classList.contains("social-btn") ||
      target.classList.contains("top-social-link") ||
      (href &&
        (href === "#" ||
          href === "/terms" ||
          href === "/newsletter-policy" ||
          href === "/forgot-password" ||
          href === "/reset-password"));

    // Don't intercept actual working pages or submit buttons inside valid forms
    if (isAction404) {
      if (target.type === "submit" && target.closest("form")) {
        return; // allow form submission
      }
      e.preventDefault();
      window.location.href = "404.html";
    }
  });
}

/* ==========================================================================
   9. GLOBAL TOAST NOTIFICATION UTILITY
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
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

window.showToast = showToast;
window.getGreetingByTime = getGreetingByTime;
