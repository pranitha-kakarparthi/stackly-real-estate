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
  initUniversal404Interceptors();
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
   7. UNIVERSAL 404 ACTION BUTTON INTERCEPTOR
   Condition: "Redirect the all actions buttons except the nav bar actions to 404 page across the website"
   Condition: "In dashboard pages: All the action buttons in the content should be redirected to 404 page"
   ========================================================================== */
function initUniversal404Interceptors() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("a, button");
    if (!target) return;

    // Allow normal operation if already on 404.html for return navigation
    if (window.location.pathname.toLowerCase().endsWith("404.html")) {
      return;
    }

    // Exempt 1: Primary Navbar and Mobile Drawer links and actions
    if (
      target.closest(".main-header") ||
      target.closest(".mobile-nav-drawer") ||
      target.closest(".auth-header")
    ) {
      return; // allow normal navbar navigation
    }

    // Specific Footer Condition: "Redirect all the footer links to '404.html' except quick links"
    const footer = target.closest(".main-footer");
    if (footer) {
      const parentCol = target.closest(".footer-links")?.closest("div");
      const colTitle = parentCol
        ?.querySelector(".footer-col-title")
        ?.textContent.trim();
      const isQuickLink =
        colTitle === "Quick Links" && target.tagName.toLowerCase() === "a";
      if (isQuickLink) {
        return; // allow quick link navigation to subpages
      }
      // All other footer links (Services, Properties, Salem HQ contact links, Socials, Brand logo, Legal links) redirect to 404
      e.preventDefault();
      window.location.href = "404.html";
      return;
    }

    // Exempt 2: Passive navigation links (breadcrumbs, auth back link)
    if (
      target.closest(".breadcrumbs") ||
      target.classList.contains("auth-back-link")
    ) {
      return; // allow standard page navigation
    }

    // Exempt 3: Form submit buttons for active functional forms
    if (target.type === "submit") {
      const form = target.closest("form");
      if (form && (form.id === "signin-form" || form.id === "signup-form")) {
        return; // allow form handlers to execute
      }
    }

    // Exempt 4: UI controls (Password visibility toggle, FAQ accordion triggers, modal/mobile close)
    if (
      target.classList.contains("password-toggle-btn") ||
      target.classList.contains("faq-trigger") ||
      target.classList.contains("modal-close-btn") ||
      target.classList.contains("mobile-close-btn") ||
      target.classList.contains("hamburger-btn")
    ) {
      return;
    }

    // Exempt 5: Dashboard internal navigation tabs and session controls
    if (
      target.classList.contains("dash-nav-link") ||
      target.classList.contains("dash-signout-btn") ||
      target.id === "dash-notif-btn" ||
      target.id === "dash-sidebar-toggle"
    ) {
      return; // allow dashboard tab switching and signout
    }

    // All action buttons (CTAs, card buttons, dashboard content action buttons, newsletter subscribe, etc.) redirect to 404!
    e.preventDefault();
    window.location.href = "404.html";
  });
}

/* ==========================================================================
   8. GLOBAL TOAST NOTIFICATION UTILITY
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
