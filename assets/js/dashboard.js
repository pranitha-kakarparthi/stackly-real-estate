/* ==========================================================================
   STACKLY REAL ESTATE - DASHBOARD CONTROLLER (dashboard.js)
   Version: 2.2.0
   Role-Adaptive Multi-View Architecture (6 Rich Sections per Subpage per Role)
   Supported Roles: Buyer, Seller, Agent, Manager, Admin
   Subpages: Overview, Portfolio, Leads, Analytics, Advisory, Settings
   All Content Action Buttons Redirect to 404
   ========================================================================== */

let activeSubpage = "overview";
let currentRole = "Buyer";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Session Guard
  const currentUser = window.StacklyStore.getCurrentUser();
  if (!currentUser) {
    window.location.href = "sign-in.html";
    return;
  }

  currentRole = currentUser.role || "Buyer";

  initHeaderUI(currentUser);
  initNotifications();
  initSidebarNavigation(currentUser);
  initRoleQuickSwitcher(currentUser);

  // Render initial subpage
  renderSubpage(activeSubpage, currentUser);
});

/* ==========================================================================
   1. HEADER PROFILE & GREETING
   ========================================================================== */
function initHeaderUI(user) {
  const greeting = window.getGreetingByTime
    ? window.getGreetingByTime()
    : "Welcome";

  const greetingEl = document.getElementById("dash-greeting-text");
  if (greetingEl) {
    greetingEl.textContent = `${greeting}, ${user.firstName || user.username || "Client"}!`;
  }

  const roleBadgeEls = document.querySelectorAll(".dash-user-role");
  roleBadgeEls.forEach((el) => {
    el.textContent = (user.role || "Buyer").toUpperCase();
  });

  const userNameEls = document.querySelectorAll(".dash-user-name");
  userNameEls.forEach((el) => {
    el.textContent =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username;
  });

  const userInitialsEls = document.querySelectorAll(".dash-user-initials");
  const initials =
    `${(user.firstName || user.username || "U")[0]}${(user.lastName || "S")[0]}`.toUpperCase();
  userInitialsEls.forEach((el) => {
    el.textContent = initials;
  });

  // Sign out
  document.querySelectorAll(".dash-signout-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.StacklyStore.clearCurrentUser();
      window.showToast("You have been securely signed out.", "info");
      setTimeout(() => {
        window.location.href = "sign-in.html";
      }, 600);
    });
  });

  // Mobile sidebar toggle
  const toggleBtn = document.getElementById("dash-sidebar-toggle");
  const sidebar = document.querySelector(".dashboard-sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
    });
  }
}

/* ==========================================================================
   2. NOTIFICATIONS
   ========================================================================== */
function initNotifications() {
  const notifBtn = document.getElementById("dash-notif-btn");
  const notifDropdown = document.getElementById("dash-notif-dropdown");
  const notifList = document.getElementById("dash-notif-list");
  const notifBadge = document.getElementById("dash-notif-badge");

  if (!notifBtn || !notifDropdown) return;

  const notifs = window.StacklyStore.getNotifications();
  if (notifBadge) {
    notifBadge.textContent = notifs.length;
  }

  if (notifList) {
    notifList.innerHTML = notifs
      .map(
        (n) => `
      <div class="notif-item ${n.read ? "" : "unread"}">
        <div style="font-weight: 600; color: var(--color-dark); margin-bottom: 2px;">${n.title}</div>
        <div style="color: var(--color-text-muted); font-size: 0.8125rem;">${n.message}</div>
        <div style="color: #94a3b8; font-size: 0.6875rem; margin-top: 4px;">${n.time}</div>
      </div>
    `
      )
      .join("");
  }

  notifBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
      notifDropdown.classList.remove("show");
    }
  });
}

/* ==========================================================================
   3. SIDEBAR NAVIGATION SWITCHER
   ========================================================================== */
function initSidebarNavigation(user) {
  const navButtons = document.querySelectorAll(".dash-nav-link");
  const sidebar = document.querySelector(".dashboard-sidebar");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const view = btn.getAttribute("data-view");
      if (!view) return;

      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      activeSubpage = view;
      if (sidebar) sidebar.classList.remove("mobile-open");

      renderSubpage(view, user);
    });
  });
}

function updateSubpageTitle(title) {
  const el = document.getElementById("current-subpage-title");
  if (el) el.textContent = title;
}

/* ==========================================================================
   4. RENDER INDEPENDENT SUBPAGE VIEWS (Role-Relevant with Rich Sections)
   ========================================================================== */
function renderSubpage(view, user) {
  const container = document.getElementById("dashboard-subpage-container");
  if (!container) return;

  const role = (user.role || currentRole || "Buyer").toLowerCase();

  switch (view) {
    case "overview":
      updateSubpageTitle(`Overview Dashboard (${role.toUpperCase()})`);
      renderOverviewView(container, user, role);
      break;
    case "portfolio":
      updateSubpageTitle(`Properties & Portfolio (${role.toUpperCase()})`);
      renderPortfolioView(container, user, role);
      break;
    case "leads":
      updateSubpageTitle(`Client Inquiries & Leads (${role.toUpperCase()})`);
      renderLeadsView(container, user, role);
      break;
    case "analytics":
      updateSubpageTitle(`Analytics & Yields (${role.toUpperCase()})`);
      renderAnalyticsView(container, user, role);
      break;
    case "advisory":
      updateSubpageTitle(`Private Broker Desk (${role.toUpperCase()})`);
      renderAdvisoryView(container, user, role);
      break;
    case "settings":
      updateSubpageTitle(`Account & Security Settings (${role.toUpperCase()})`);
      renderSettingsView(container, user, role);
      break;
    default:
      renderOverviewView(container, user, role);
  }
}

/* --------------------------------------------------------------------------
   VIEW 1: OVERVIEW DASHBOARD
   -------------------------------------------------------------------------- */
function renderOverviewView(container, user, role) {
  if (role === "seller") {
    container.innerHTML = `
      <!-- Quick Actions Toolbar -->
      <div class="quick-actions-bar">
        <span class="quick-actions-label">Quick Actions:</span>
        <button class="action-chip action-404">+ Add New Listing</button>
        <button class="action-chip action-404">Download Valuation Report</button>
        <button class="action-chip action-404">Review Buyer Offers</button>
        <button class="action-chip action-404">Book 4K Drone Scan</button>
        <button class="action-chip action-404">Manage Showing Hours</button>
      </div>

      <!-- S1: Seller KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-info"><h6>Active Listings Value</h6><div class="kpi-number">₹8.40 Cr</div><div class="kpi-trend positive">3 Properties Live</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Search Impressions</h6><div class="kpi-number">1,420</div><div class="kpi-trend positive">↑ 18% this week</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Verified Buyer Offers</h6><div class="kpi-number">5 Offers</div><div class="kpi-trend positive">2 Awaiting Counter</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Avg Days on Market</h6><div class="kpi-number">24 Days</div><div class="kpi-trend positive">Salem Avg: 48 Days</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg></div></div>
      </div>

      <!-- S2: Active Listings Exposure Table -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <h3 class="dash-panel-title">My Published Property Listings</h3>
          <button class="btn btn-primary btn-sm action-404">+ Add New Property</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Property Name</th><th>Locality</th><th>Asking Price</th><th>Views</th><th>Inquiries</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>Fairlands Modern Haven</strong></td><td>Fairlands, Salem</td><td>₹1.65 Cr</td><td>482</td><td>14 Leads</td><td><span class="status-pill status-active">Active</span></td><td><button class="btn btn-ghost btn-sm action-404">Manage</button></td></tr>
              <tr><td><strong>Green Valley Orchard Villa</strong></td><td>Yercaud Foothills</td><td>₹2.20 Cr</td><td>640</td><td>22 Leads</td><td><span class="status-pill status-active">Active</span></td><td><button class="btn btn-ghost btn-sm action-404">Manage</button></td></tr>
              <tr><td><strong>Silver Springs Duplex</strong></td><td>Hasthampatti</td><td>₹1.15 Cr</td><td>298</td><td>9 Leads</td><td><span class="status-pill status-pending">Offer Review</span></td><td><button class="btn btn-ghost btn-sm action-404">Review Offer</button></td></tr>
              <tr><td><strong>Meyyanur Corporate Plaza</strong></td><td>Meyyanur Commercial</td><td>₹3.40 Cr</td><td>715</td><td>18 Leads</td><td><span class="status-pill status-active">Active</span></td><td><button class="btn btn-ghost btn-sm action-404">Manage</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S3: High-Conviction Buyer Offers -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <h3 class="dash-panel-title">Formal Purchase Offers Received</h3>
          <button class="btn btn-outline btn-sm action-404">Download Ledger</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Buyer Ref</th><th>Property Target</th><th>Offer Price</th><th>Token Proof</th><th>Offer Validity</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>BYR-8421 (NRI London)</strong></td><td>Green Valley Villa</td><td>₹2.15 Cr</td><td><span class="status-pill status-active">₹10L Verified</span></td><td>In 2 Days</td><td><button class="btn btn-primary btn-sm action-404">Accept Offer</button></td></tr>
              <tr><td><strong>BYR-7729 (Doctor Salem)</strong></td><td>Silver Springs Duplex</td><td>₹1.10 Cr</td><td><span class="status-pill status-active">₹5L Verified</span></td><td>In 4 Days</td><td><button class="btn btn-dark btn-sm action-404">Counter Offer</button></td></tr>
              <tr><td><strong>BYR-9104 (Tech Founder)</strong></td><td>Fairlands Modern</td><td>₹1.60 Cr</td><td><span class="status-pill status-active">₹15L Verified</span></td><td>In 1 Day</td><td><button class="btn btn-primary btn-sm action-404">Accept Offer</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S4 & S5: Appointments & Legal Clearance -->
      <div class="grid-2">
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Scheduled Buyer Viewing Appointments</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1rem;">Tomorrow, 11:30 AM: Accompanied viewing for Green Valley Villa with Senior Consultant Karthik Raja.</p>
          <div class="step-timeline">
            <div class="step-timeline-item done"><div class="step-timeline-title">Buyer Vetting Completed</div><div class="step-timeline-desc">Financial solvency and proof of funds verified.</div></div>
            <div class="step-timeline-item"><div class="step-timeline-title">Site Escort Dispatch</div><div class="step-timeline-desc">Executive chauffeur departs Salem HQ at 10:45 AM.</div></div>
          </div>
          <button class="btn btn-outline btn-sm action-404" style="margin-top: 1rem;">Confirm Schedule</button>
        </div>
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Title & Legal Clearance Dossier</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">All parent deeds (1994-2024), 30-year Encumbrance Certificates, and DTCP sanction orders approved.</p>
          <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width: 100%;"></div></div>
          <p style="font-size: 0.75rem; color: var(--color-primary); font-weight: 600;">100% Legal Title Purity Index Verified</p>
          <button class="btn btn-dark btn-sm action-404" style="margin-top: 0.75rem;">Download Legal Dossier</button>
        </div>
      </div>

      <!-- S6: Salem Infrastructure Radar -->
      <div class="dash-panel" style="margin-top: 1.5rem;">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Salem Regional Infrastructure & Valuation Impact</h3></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Project Corridor</th><th>Status</th><th>Distance to Assets</th><th>Projected Appreciation</th><th>Impact Rating</th></tr></thead>
            <tbody>
              <tr><td><strong>Bangalore-Salem-Cochin Industrial Corridor</strong></td><td>Under Construction</td><td>4.2 km from Meyyanur</td><td>+14.5% YoY</td><td><span class="status-pill status-active">Very High</span></td></tr>
              <tr><td><strong>Salem Metro Rail Phase-1 Feasibility</strong></td><td>DPR Approved</td><td>800m from Fairlands</td><td>+18.0% YoY</td><td><span class="status-pill status-active">Prime Catalyst</span></td></tr>
              <tr><td><strong>Yercaud Eco-Tourism Buffer Zone</strong></td><td>Gazette Notified</td><td>Adjacent to Foothills</td><td>+11.2% YoY</td><td><span class="status-pill status-active">Green Sanctuary</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (role === "agent") {
    container.innerHTML = `
      <!-- Quick Actions Toolbar -->
      <div class="quick-actions-bar">
        <span class="quick-actions-label">Broker Console:</span>
        <button class="action-chip action-404">+ Add Client Lead</button>
        <button class="action-chip action-404">Schedule VIP Site Escort</button>
        <button class="action-chip action-404">Draft Mandate Agreement</button>
        <button class="action-chip action-404">Commission Calculator</button>
        <button class="action-chip action-404">Export Pipeline Ledger</button>
      </div>

      <!-- S1: Agent KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-info"><h6>Closed Deal Volume</h6><div class="kpi-number">₹24.5 Cr</div><div class="kpi-trend positive">YTD Realized</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Active Client Mandates</h6><div class="kpi-number">8 Units</div><div class="kpi-trend positive">Exclusive Mandates</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Pending Brokerage</h6><div class="kpi-number">₹18.2 L</div><div class="kpi-trend positive">Closing This Month</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Client Net Satisfaction</h6><div class="kpi-number">4.9 / 5</div><div class="kpi-trend positive">48 Reviews</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div></div>
      </div>

      <!-- S2: Client Deal Pipeline -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Active Brokerage Pipeline & Escrow Stage</h3><button class="btn btn-outline btn-sm action-404">Export Pipeline</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Client Name</th><th>Property Mandate</th><th>Deal Value</th><th>Pipeline Stage</th><th>Est. Commission</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>Mr. Suresh Sundaram</strong></td><td>Beverly Estate Villa</td><td>₹1.85 Cr</td><td><span class="status-pill status-active">Sale Deed Drafted</span></td><td>₹1,85,000</td><td><button class="btn btn-primary btn-sm action-404">Coordinate Registry</button></td></tr>
              <tr><td><strong>Dr. Meenakshi Raman</strong></td><td>Cyber Commercial Park</td><td>₹3.40 Cr</td><td><span class="status-pill status-pending">Escrow Deposited</span></td><td>₹3,40,000</td><td><button class="btn btn-ghost btn-sm action-404">Inspect Escrow</button></td></tr>
              <tr><td><strong>Anand Textiles Group</strong></td><td>Salem Ring Road Industrial</td><td>₹4.20 Cr</td><td><span class="status-pill status-pending">Site Inspection</span></td><td>₹4,20,000</td><td><button class="btn btn-ghost btn-sm action-404">Follow Up</button></td></tr>
              <tr><td><strong>Capt. R. Mohan (NRI)</strong></td><td>Lakeview Palms Villa</td><td>₹2.45 Cr</td><td><span class="status-pill status-active">FEMA PoA Clearance</span></td><td>₹2,45,000</td><td><button class="btn btn-primary btn-sm action-404">Notify Bank</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S3: High-Priority Site Inspections Today -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Priority Client Inspections (Today's Roster)</h3><button class="btn btn-dark btn-sm action-404">+ Add Inspection</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Time</th><th>Buyer Contact</th><th>Property Target</th><th>Meeting Location</th><th>Escort Vehicle</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>02:00 PM</strong></td><td>Ramesh Varma (+91 98401 23456)</td><td>Gokulam Villa 4</td><td>MMR Complex Salem HQ</td><td>Stackly Innova Executive</td><td><span class="status-pill status-active">Confirmed</span></td><td><button class="btn btn-ghost btn-sm action-404">Start Visit</button></td></tr>
              <tr><td><strong>04:30 PM</strong></td><td>Kavitha Natarajan (+91 99420 88765)</td><td>Fairlands Penthouse</td><td>Fairlands Main Gate</td><td>Client Personal Vehicle</td><td><span class="status-pill status-pending">Vehicle Reserved</span></td><td><button class="btn btn-ghost btn-sm action-404">Call Client</button></td></tr>
              <tr><td><strong>06:00 PM</strong></td><td>Raghavan K. (+91 94432 11980)</td><td>Chinna Thirupathi Plots</td><td>Site Office</td><td>Chauffeur Sedan</td><td><span class="status-pill status-active">Confirmed</span></td><td><button class="btn btn-ghost btn-sm action-404">Briefing Pack</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S4 & S5: Exclusive Mandates & RERA Compliance -->
      <div class="grid-2">
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Exclusive Mandates Performance</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Average sales turnaround on Stackly broker network is 19 days with 98.4% price realization.</p>
          <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width: 88%;"></div></div>
          <p style="font-size: 0.75rem; color: #64748b;">Target: 85% Quarterly Mandate Clearance (Current: 88%)</p>
          <button class="btn btn-outline btn-sm action-404" style="margin-top: 1rem;">View Mandates</button>
        </div>
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">TN RERA Agent License Compliance</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">License TN/AGENT/2024/0912 active and verified. Annual compliance filing verified for 2026.</p>
          <div class="info-callout" style="margin: 0.75rem 0;">Status: Full Regulatory Good Standing • Valid until Dec 2028</div>
          <button class="btn btn-dark btn-sm action-404">View Certificate</button>
        </div>
      </div>

      <!-- S6: Commission Payout Matrix -->
      <div class="dash-panel" style="margin-top: 1.5rem;">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Broker Commission Realization Schedule</h3><button class="btn btn-outline btn-sm action-404">Bank Details</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Transaction Ref</th><th>Property</th><th>Total Brokerage</th><th>TDS Deducted</th><th>Net Payable</th><th>Disbursement Date</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><strong>COM-2026-081</strong></td><td>Hasthampatti Residency</td><td>₹1,85,000</td><td>₹9,250</td><td>₹1,75,750</td><td>30 Sep 2026</td><td><span class="status-pill status-active">Approved</span></td></tr>
              <tr><td><strong>COM-2026-079</strong></td><td>Fairlands High Street</td><td>₹2,10,000</td><td>₹10,500</td><td>₹1,99,500</td><td>15 Oct 2026</td><td><span class="status-pill status-pending">In Escrow</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (role === "manager") {
    container.innerHTML = `
      <!-- Quick Actions Toolbar -->
      <div class="quick-actions-bar">
        <span class="quick-actions-label">Property Desk:</span>
        <button class="action-chip action-404">+ Dispatch Vendor</button>
        <button class="action-chip action-404">Issue Rent Invoices</button>
        <button class="action-chip action-404">Generate Tenancy Lease</button>
        <button class="action-chip action-404">Municipal Tax Ledger</button>
        <button class="action-chip action-404">Emergency Maintenance</button>
      </div>

      <!-- S1: Manager KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-info"><h6>Managed Units</h6><div class="kpi-number">42 Units</div><div class="kpi-trend positive">Residential & Commercial</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Portfolio Occupancy</h6><div class="kpi-number">96.4%</div><div class="kpi-trend positive">Only 2 Vacancies</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Monthly Rent Escrow</h6><div class="kpi-number">₹18.8 L</div><div class="kpi-trend positive">98% Collected On Time</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Open Work Orders</h6><div class="kpi-number">2 Tickets</div><div class="kpi-trend positive">Under 4h SLA</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div></div>
      </div>

      <!-- S2: Rent Collection Ledger -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Tenancy Rent Escrow & Invoicing Ledger</h3><button class="btn btn-outline btn-sm action-404">Export CSV</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Property Unit</th><th>Tenant Entity</th><th>Monthly Rent</th><th>Due Date</th><th>Escrow Account</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>Green Enclave 201</strong></td><td>Vikramaditya Rao</td><td>₹45,000</td><td>1st of Month</td><td>Axis Escrow #9182</td><td><span class="status-pill status-active">Paid On-Time</span></td><td><button class="btn btn-ghost btn-sm action-404">Receipt</button></td></tr>
              <tr><td><strong>Meyyanur Commercial 3B</strong></td><td>Cognitive Labs Pvt Ltd</td><td>₹1,20,000</td><td>5th of Month</td><td>HDFC Escrow #4102</td><td><span class="status-pill status-active">Paid Direct</span></td><td><button class="btn btn-ghost btn-sm action-404">Receipt</button></td></tr>
              <tr><td><strong>Fairlands Villa B</strong></td><td>Deepak Chandran</td><td>₹65,000</td><td>7th of Month</td><td>Axis Escrow #9182</td><td><span class="status-pill status-pending">Invoice Sent</span></td><td><button class="btn btn-ghost btn-sm action-404">Send Reminder</button></td></tr>
              <tr><td><strong>Chinna Thirupathi Retail</strong></td><td>Saravana Store Hub</td><td>₹85,000</td><td>10th of Month</td><td>SBI Escrow #0981</td><td><span class="status-pill status-active">Paid On-Time</span></td><td><button class="btn btn-ghost btn-sm action-404">Receipt</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S3: Maintenance Work Orders -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Active Facility Maintenance Tickets</h3><button class="btn btn-primary btn-sm action-404">+ Dispatch Vendor</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Ticket ID</th><th>Property</th><th>Issue Category</th><th>Vendor Assigned</th><th>SLA Timer</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>TKT-412</strong></td><td>Fairlands Villa B</td><td>Water Booster Pump</td><td>Salem Hydro Services</td><td>2 Hours Remaining</td><td><button class="btn btn-ghost btn-sm action-404">Track Vendor</button></td></tr>
              <tr><td><strong>TKT-408</strong></td><td>Green Enclave</td><td>Elevator Bi-Monthly Service</td><td>Otis Tamil Nadu Desk</td><td>Completed (Pending Signoff)</td><td><button class="btn btn-ghost btn-sm action-404">Approve Invoice</button></td></tr>
              <tr><td><strong>TKT-399</strong></td><td>Meyyanur Complex</td><td>Fire Safety Sensor Audit</td><td>Salem Safety Systems</td><td>Completed & Certified</td><td><button class="btn btn-ghost btn-sm action-404">View Certificate</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S4 & S5: Lease Expirations & Tax Compliance -->
      <div class="grid-2">
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Upcoming Lease Expirations</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">2 agreements expiring in next 60 days. Renewal notices dispatched with standard 5% escalation clause.</p>
          <div class="step-timeline">
            <div class="step-timeline-item done"><div class="step-timeline-title">Cognitive Labs (Meyyanur)</div><div class="step-timeline-desc">Renewal agreement agreed for 36 months.</div></div>
            <div class="step-timeline-item"><div class="step-timeline-title">Deepak Chandran (Fairlands)</div><div class="step-timeline-desc">Draft sent for electronic signature.</div></div>
          </div>
          <button class="btn btn-outline btn-sm action-404" style="margin-top: 1rem;">View Leases</button>
        </div>
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Salem Municipal Tax & Water Charges</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Salem City Municipal Corporation property tax cleared for Q1 & Q2 2026. Zero penalty backlog.</p>
          <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width: 100%;"></div></div>
          <p style="font-size: 0.75rem; color: var(--color-primary); font-weight: 600;">100% Municipal Clearance Challans Active</p>
          <button class="btn btn-dark btn-sm action-404" style="margin-top: 1rem;">Tax Challans</button>
        </div>
      </div>

      <!-- S6: Vendor Contractors Directory -->
      <div class="dash-panel" style="margin-top: 1.5rem;">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Approved Salem Vendor Contractors</h3><button class="btn btn-outline btn-sm action-404">+ Add Vendor</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Contractor Agency</th><th>Service Domain</th><th>Salem Office Location</th><th>Contact Phone</th><th>Rating</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><strong>Salem Hydro Mechanics</strong></td><td>Plumbing & Booster Pumps</td><td>Fairlands Bypass</td><td>+91 94432 40011</td><td>4.8 / 5</td><td><span class="status-pill status-active">Active Contract</span></td></tr>
              <tr><td><strong>Kaveri Electrical Engineers</strong></td><td>HT Substations & Generators</td><td>Chinna Thirupathi</td><td>+91 98421 55670</td><td>4.9 / 5</td><td><span class="status-pill status-active">Active Contract</span></td></tr>
              <tr><td><strong>Green Horizon Landscapers</strong></td><td>Villa Gardens & Turf Care</td><td>Yercaud Main Road</td><td>+91 97890 33420</td><td>4.7 / 5</td><td><span class="status-pill status-active">Active Contract</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (role === "admin") {
    container.innerHTML = `
      <!-- Quick Actions Toolbar -->
      <div class="quick-actions-bar">
        <span class="quick-actions-label">System Control:</span>
        <button class="action-chip action-404">Verify Pending RERA</button>
        <button class="action-chip action-404">Audit Bank Escrows</button>
        <button class="action-chip action-404">Trigger Database Backup</button>
        <button class="action-chip action-404">Role Access Matrix</button>
        <button class="action-chip action-404">Server Logs</button>
      </div>

      <!-- S1: Admin Platform KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-info"><h6>Platform GMV</h6><div class="kpi-number">₹142.8 Cr</div><div class="kpi-trend positive">↑ 22% QoQ Volume</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Registered Users</h6><div class="kpi-number">2,420</div><div class="kpi-trend positive">540 Active This Week</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Audit Verification Queue</h6><div class="kpi-number">7 Pending</div><div class="kpi-trend positive">RERA Documents</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Server Node Health</h6><div class="kpi-number">99.98%</div><div class="kpi-trend positive">Salem AWS Edge Node</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div></div>
      </div>

      <!-- S2: Role Telemetry & User Governance -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Platform User & Role Governance Directory</h3><button class="btn btn-outline btn-sm action-404">Export User Registry</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>User Entity</th><th>Assigned Role</th><th>City / Location</th><th>Registered Date</th><th>KYC Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>Prakash Narayanan</strong></td><td>Verified Seller</td><td>Salem Central</td><td>14 Mar 2026</td><td><span class="status-pill status-active">Aadhaar & Patta Verified</span></td><td><button class="btn btn-ghost btn-sm action-404">Audit User</button></td></tr>
              <tr><td><strong>Karthik Raja & Team</strong></td><td>Licensed Agent</td><td>MMR Complex Salem</td><td>10 Jan 2026</td><td><span class="status-pill status-active">RERA Certified</span></td><td><button class="btn btn-ghost btn-sm action-404">Audit User</button></td></tr>
              <tr><td><strong>Vigneshwara Realty</strong></td><td>Property Manager</td><td>Hasthampatti Salem</td><td>02 Feb 2026</td><td><span class="status-pill status-active">Corporate Escrow Active</span></td><td><button class="btn btn-ghost btn-sm action-404">Audit User</button></td></tr>
              <tr><td><strong>Deepak Kumar</strong></td><td>Active Buyer</td><td>Chinna Thirupathi</td><td>20 Mar 2026</td><td><span class="status-pill status-active">Identity Verified</span></td><td><button class="btn btn-ghost btn-sm action-404">Audit User</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S3: High-Risk Escrow Monitor -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Institutional Escrow Accounts Monitor</h3><button class="btn btn-dark btn-sm action-404">Bank Reconciliation</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Escrow ID</th><th>Property Transaction</th><th>Deposit Bank</th><th>Escrow Balance</th><th>Audit Trail</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>ESC-901</strong></td><td>Beverly Estate Villa 2</td><td>Axis Bank Chinna Thirupathi</td><td>₹25,00,000</td><td><span class="status-pill status-active">Clean Clearance</span></td><td><button class="btn btn-ghost btn-sm action-404">View Ledger</button></td></tr>
              <tr><td><strong>ESC-892</strong></td><td>Fairlands Heights High-Rise</td><td>HDFC Bank Salem Main</td><td>₹1,10,00,000</td><td><span class="status-pill status-active">Institutional Mandate</span></td><td><button class="btn btn-ghost btn-sm action-404">View Ledger</button></td></tr>
              <tr><td><strong>ESC-870</strong></td><td>Yercaud Foothills Retreat</td><td>ICICI Bank Meyyanur</td><td>₹45,00,000</td><td><span class="status-pill status-active">Clean Clearance</span></td><td><button class="btn btn-ghost btn-sm action-404">View Ledger</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S4 & S5: Moderation & System Security -->
      <div class="grid-2">
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Property Moderation & Title Approval</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">4 new builder projects awaiting DTCP and survey number clearance before homepage featuring.</p>
          <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width: 75%;"></div></div>
          <p style="font-size: 0.75rem; color: #64748b;">75% of submissions approved this week</p>
          <button class="btn btn-primary btn-sm action-404" style="margin-top: 1rem;">Inspect Queue</button>
        </div>
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Database Vault & Cloud Backups</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Automated real-time PostgreSQL replication, 256-bit AES encryption active across all deed PDFs.</p>
          <div class="info-callout" style="margin: 0.75rem 0;">Last Full Snapshot: 12 minutes ago (Zero Data Loss Protocol)</div>
          <button class="btn btn-dark btn-sm action-404">System Logs</button>
        </div>
      </div>

      <!-- S6: API & Webhook Health -->
      <div class="dash-panel" style="margin-top: 1.5rem;">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Regional Gateway & API Endpoints Telemetry</h3></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Gateway Name</th><th>Endpoint</th><th>Latency</th><th>Success Rate</th><th>Last Ping</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><strong>RERA Tamil Nadu Registry Sync</strong></td><td>/api/v1/rera/verify</td><td>42ms</td><td>99.9%</td><td>Just now</td><td><span class="status-pill status-active">Operational</span></td></tr>
              <tr><td><strong>Sub-Registrar Patta Verification</strong></td><td>/api/v1/patta/lookup</td><td>88ms</td><td>99.7%</td><td>2 mins ago</td><td><span class="status-pill status-active">Operational</span></td></tr>
              <tr><td><strong>Bank Escrow Webhook (HDFC)</strong></td><td>/api/v1/escrow/notify</td><td>31ms</td><td>100.0%</td><td>Just now</td><td><span class="status-pill status-active">Operational</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    // Default: Buyer
    container.innerHTML = `
      <!-- Quick Actions Toolbar -->
      <div class="quick-actions-bar">
        <span class="quick-actions-label">Buyer Shortcuts:</span>
        <button class="action-chip action-404">+ Request VIP Site Tour</button>
        <button class="action-chip action-404">Compare Shortlist</button>
        <button class="action-chip action-404">Download Loan Sanction</button>
        <button class="action-chip action-404">Title Verification Lookup</button>
        <button class="action-chip action-404">Talk to Concierge</button>
      </div>

      <!-- S1: Buyer KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-info"><h6>Saved Sanctuaries</h6><div class="kpi-number">6 Mansions</div><div class="kpi-trend positive">100% RERA Verified</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Scheduled Tours</h6><div class="kpi-number">3 Tours</div><div class="kpi-trend positive">Next: Tomorrow 11 AM</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Pre-Approved Loan</h6><div class="kpi-number">₹2.20 Cr</div><div class="kpi-trend positive">Sanctioned by HDFC</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Title Purity Index</h6><div class="kpi-number">100%</div><div class="kpi-trend positive">Zero Litigation Guarantee</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div></div>
      </div>

      <!-- S2: Bookmarked Luxury Sanctuaries -->
      <div class="dash-panel">
        <div class="dash-panel-header">
          <h3 class="dash-panel-title">My Shortlisted Luxury Sanctuaries</h3>
          <button class="btn btn-outline btn-sm action-404">Compare All (4)</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Property Name</th><th>Locality</th><th>Configurations</th><th>Price</th><th>Title Purity</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>Grand Beverly Hills Manor</strong></td><td>Hasthampatti, Salem</td><td>4 BHK • 3,850 sq.ft</td><td>₹1.85 Cr</td><td><span class="status-pill status-active">Clear Title 30Y</span></td><td><span class="status-pill status-active">Available</span></td><td><button class="btn btn-primary btn-sm action-404">Schedule Tour</button></td></tr>
              <tr><td><strong>Lakeview Palms Private Villa</strong></td><td>Yercaud Foothills</td><td>5 BHK • 4,200 sq.ft</td><td>₹2.45 Cr</td><td><span class="status-pill status-active">DTCP Approved</span></td><td><span class="status-pill status-active">Available</span></td><td><button class="btn btn-primary btn-sm action-404">Schedule Tour</button></td></tr>
              <tr><td><strong>Fairlands Modern Enclave</strong></td><td>Fairlands, Salem</td><td>3 BHK • 2,400 sq.ft</td><td>₹1.40 Cr</td><td><span class="status-pill status-active">RERA Registered</span></td><td><span class="status-pill status-active">Available</span></td><td><button class="btn btn-primary btn-sm action-404">Schedule Tour</button></td></tr>
              <tr><td><strong>Emerald Hillview Penthouse</strong></td><td>Alagapuram, Salem</td><td>4 BHK • 3,100 sq.ft</td><td>₹1.75 Cr</td><td><span class="status-pill status-active">Clear Title 30Y</span></td><td><span class="status-pill status-pending">Offer in Review</span></td><td><button class="btn btn-primary btn-sm action-404">Schedule Tour</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S3: Scheduled VIP Site Tours -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Upcoming VIP Accompanied Site Tours</h3><button class="btn btn-dark btn-sm action-404">+ Request New Visit</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Date & Time</th><th>Property Target</th><th>Senior Advisor</th><th>Chauffeur Pickup</th><th>Tour Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>Tomorrow, 11:00 AM</strong></td><td>Grand Beverly Hills Manor</td><td>Karthik Raja (Principal Broker)</td><td>Salem Junction Executive Lounge</td><td><span class="status-pill status-active">Confirmed</span></td><td><button class="btn btn-ghost btn-sm action-404">Reschedule</button></td></tr>
              <tr><td><strong>Saturday, 03:30 PM</strong></td><td>Lakeview Palms Villa</td><td>Ananya Sharma (Sales Director)</td><td>Hotel Radisson Salem Lobby</td><td><span class="status-pill status-pending">Vehicle Reserved</span></td><td><button class="btn btn-ghost btn-sm action-404">Call Driver</button></td></tr>
              <tr><td><strong>Next Tuesday, 10:00 AM</strong></td><td>Fairlands Modern Enclave</td><td>Karthik Raja (Principal Broker)</td><td>Fairlands Main Gate</td><td><span class="status-pill status-active">Confirmed</span></td><td><button class="btn btn-ghost btn-sm action-404">Details</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S4 & S5: Loan Pre-Approval & Legal Clearance -->
      <div class="grid-2">
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Bank Escrow & Mortgage Pre-Approval</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Sanction Letter issued by HDFC Bank Salem Branch. Interest locked at 8.40% p.a. for 60 days.</p>
          <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width: 100%;"></div></div>
          <p style="font-size: 0.75rem; color: var(--color-primary); font-weight: 600;">Sanctioned Amount: ₹2,20,00,000 (Ready for Disbursement)</p>
          <button class="btn btn-outline btn-sm action-404" style="margin-top: 1rem;">Download Sanction Letter</button>
        </div>
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Title Audit & Encumbrance Verification</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Stackly legal panel has conducted 30-year deed traces for all your shortlisted properties.</p>
          <div class="info-callout" style="margin: 0.75rem 0;">Status: Zero Litigation • Encumbrance Certificate (EC) Nil verified until 2026</div>
          <button class="btn btn-dark btn-sm action-404">View Legal Clearance</button>
        </div>
      </div>

      <!-- S6: Buying Readiness Checklist -->
      <div class="dash-panel" style="margin-top: 1.5rem;">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Home Acquisition Readiness Checklist</h3></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Milestone Step</th><th>Requirement</th><th>Verification Desk</th><th>Timeline</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><strong>1. KYC & Proof of Identity</strong></td><td>Aadhaar & PAN Submission</td><td>Stackly Onboarding Team</td><td>Completed</td><td><span class="status-pill status-active">Verified</span></td></tr>
              <tr><td><strong>2. Mortgage Eligibility</strong></td><td>Bank Pre-Approval Certificate</td><td>HDFC Bank Salem</td><td>Completed</td><td><span class="status-pill status-active">Verified</span></td></tr>
              <tr><td><strong>3. Private Site Inspection</strong></td><td>Accompanied VIP Tour</td><td>Senior Broker Desk</td><td>In Progress</td><td><span class="status-pill status-pending">Scheduled</span></td></tr>
              <tr><td><strong>4. Token Deposit Escrow</strong></td><td>Token Amount Allocation</td><td>Bank Escrow Desk</td><td>Pending Tour</td><td><span class="status-pill status-pending">Pending</span></td></tr>
              <tr><td><strong>5. Registry Sale Deed Execution</strong></td><td>Sub-Registrar Salem Filing</td><td>Senior Legal Panel</td><td>Closing Stage</td><td><span class="status-pill status-pending">Pending</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

/* --------------------------------------------------------------------------
   VIEW 2: PORTFOLIO & ASSETS
   -------------------------------------------------------------------------- */
function renderPortfolioView(container, user, role) {
  if (role === "seller") {
    container.innerHTML = `
      <div class="quick-actions-bar">
        <span class="quick-actions-label">Portfolio Tools:</span>
        <button class="action-chip action-404">+ Add New Property</button>
        <button class="action-chip action-404">Download Valuation Dossier</button>
        <button class="action-chip action-404">Manage Digital 3D Tour</button>
        <button class="action-chip action-404">Export Tax Records</button>
      </div>

      <!-- S1: Portfolio Valuation Summary -->
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-info"><h6>Total Listed Valuation</h6><div class="kpi-number">₹8.40 Cr</div><div class="kpi-trend positive">3 Estates</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Average Asking Rate</h6><div class="kpi-number">₹5,420 / sq.ft</div><div class="kpi-trend positive">Salem Top Decile</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Escrow Earnest Money</h6><div class="kpi-number">₹15,00,000</div><div class="kpi-trend positive">In Bank Escrow</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Marketing Reach</h6><div class="kpi-number">24,500+</div><div class="kpi-trend positive">Targeted HNW Outreach</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div></div>
      </div>

      <!-- S2: My Properties Detailed Table -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Active Property Inventory Under Mandate</h3><button class="btn btn-primary btn-sm action-404">+ Add New Property</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Property Name</th><th>Category</th><th>Survey Number</th><th>Asking Price</th><th>Leads Generated</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>Fairlands Modern Haven</strong></td><td>Independent Villa</td><td>SF-184/2A</td><td>₹1.65 Cr</td><td>28 Leads</td><td><span class="status-pill status-active">Active</span></td><td><button class="btn btn-ghost btn-sm action-404">Edit Details</button></td></tr>
              <tr><td><strong>Green Valley Orchard Villa</strong></td><td>Luxury Villa</td><td>SF-92/4B</td><td>₹2.20 Cr</td><td>41 Leads</td><td><span class="status-pill status-active">Active</span></td><td><button class="btn btn-ghost btn-sm action-404">Edit Details</button></td></tr>
              <tr><td><strong>Silver Springs Duplex</strong></td><td>Duplex Flat</td><td>SF-310/1C</td><td>₹1.15 Cr</td><td>19 Leads</td><td><span class="status-pill status-pending">Offer Review</span></td><td><button class="btn btn-ghost btn-sm action-404">Edit Details</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S3: CMA Price Optimization -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Comparative Market Analysis (CMA) Benchmarks</h3><button class="btn btn-outline btn-sm action-404">Re-evaluate Price</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Locality</th><th>Average Sold Price</th><th>Stackly Recommended Rate</th><th>Buyer Demand Index</th><th>Projected Days to Close</th></tr></thead>
            <tbody>
              <tr><td><strong>Fairlands (Prime Sector)</strong></td><td>₹6,200 / sq.ft</td><td>₹6,450 / sq.ft</td><td><span class="status-pill status-active">Very High (9.4/10)</span></td><td>22 Days</td></tr>
              <tr><td><strong>Hasthampatti (Gated)</strong></td><td>₹5,100 / sq.ft</td><td>₹5,350 / sq.ft</td><td><span class="status-pill status-active">High (8.7/10)</span></td><td>28 Days</td></tr>
              <tr><td><strong>Yercaud Foothills</strong></td><td>₹3,900 / sq.ft</td><td>₹4,150 / sq.ft</td><td><span class="status-pill status-active">Steady (7.8/10)</span></td><td>35 Days</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S4 & S5: Drone Scans & Settlement Ledger -->
      <div class="grid-2">
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">4K Drone Spatial Asset & Architecture Dossier</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">High-resolution aerial videos, 3D interactive floor plans, and digital brochures are active.</p>
          <div class="step-timeline">
            <div class="step-timeline-item done"><div class="step-timeline-title">Aerial Drone Video</div><div class="step-timeline-desc">Captured in 4K 60fps with boundary overlays.</div></div>
            <div class="step-timeline-item done"><div class="step-timeline-title">Matterport 3D Walkthrough</div><div class="step-timeline-desc">Live on listing page with 1,240 views.</div></div>
          </div>
          <button class="btn btn-outline btn-sm action-404" style="margin-top: 1rem;">View Media Kit</button>
        </div>
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Seller Settlement & Escrow Vault</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Dedicated bank escrow vault configured with HDFC Bank Salem for automatic closing disbursements.</p>
          <div class="info-callout" style="margin: 0.75rem 0;">Escrow Bank: HDFC Chinna Thirupathi • A/C #****8821 • Status: Verified</div>
          <button class="btn btn-dark btn-sm action-404">View Banking Setup</button>
        </div>
      </div>

      <!-- S6: Structural Inspection Audit -->
      <div class="dash-panel" style="margin-top: 1.5rem;">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Asset Physical Health & Structural Certifications</h3></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Property Name</th><th>Certified Engineer</th><th>Inspection Date</th><th>Structural Rating</th><th>Certificate</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>Fairlands Modern Haven</strong></td><td>Er. S. Velmurugan M.E.</td><td>15 Feb 2026</td><td>Grade A+ (Pristine)</td><td>ST-2026-091</td><td><button class="btn btn-ghost btn-sm action-404">Download</button></td></tr>
              <tr><td><strong>Green Valley Villa</strong></td><td>Er. R. Soundarajan M.E.</td><td>10 Jan 2026</td><td>Grade A+ (Pristine)</td><td>ST-2026-042</td><td><button class="btn btn-ghost btn-sm action-404">Download</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    // Default Buyer / General Portfolio
    container.innerHTML = `
      <div class="quick-actions-bar">
        <span class="quick-actions-label">Portfolio Tools:</span>
        <button class="action-chip action-404">Download Title Dossier</button>
        <button class="action-chip action-404">Export Acquisition Ledger</button>
        <button class="action-chip action-404">Book Surveyor Visit</button>
        <button class="action-chip action-404">Request 3D Blueprints</button>
      </div>

      <!-- S1: Buyer Portfolio KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-info"><h6>Acquired Portfolio Value</h6><div class="kpi-number">₹3.25 Cr</div><div class="kpi-trend positive">2 Prime Salem Assets</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Unrealized Appreciation</h6><div class="kpi-number">+₹38.5 L</div><div class="kpi-trend positive">↑ 11.8% Since Purchase</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Active Token Deposits</h6><div class="kpi-number">₹10,00,000</div><div class="kpi-trend positive">Under Escrow Hold</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div></div>
        <div class="kpi-card"><div class="kpi-info"><h6>Rental Yield Realized</h6><div class="kpi-number">7.4% p.a.</div><div class="kpi-trend positive">Leased to Corporates</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div></div>
      </div>

      <!-- S2: Acquired Assets Registry Table -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">My Real Estate Assets & Registry Deeds</h3><button class="btn btn-outline btn-sm action-404">Download Deeds</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Property Name</th><th>Sub-Registrar Doc #</th><th>Purchase Date</th><th>Acquisition Value</th><th>Current Valuation</th><th>Occupancy</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td><strong>Gokulam Estate Villa 4</strong></td><td>DOC-2024-4819</td><td>14 Nov 2024</td><td>₹1.85 Cr</td><td>₹2.10 Cr</td><td><span class="status-pill status-active">Self Occupied</span></td><td><button class="btn btn-ghost btn-sm action-404">Deed Vault</button></td></tr>
              <tr><td><strong>Fairlands Commercial Suite</strong></td><td>DOC-2025-1022</td><td>22 May 2025</td><td>₹1.40 Cr</td><td>₹1.53 Cr</td><td><span class="status-pill status-active">Leased (₹65k/mo)</span></td><td><button class="btn btn-ghost btn-sm action-404">Deed Vault</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S3: Property Comparison Matrix -->
      <div class="dash-panel">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Active Shortlist Comparative Evaluation</h3><button class="btn btn-dark btn-sm action-404">+ Add to Compare</button></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Feature Parameter</th><th>Grand Beverly Manor</th><th>Lakeview Palms Villa</th><th>Fairlands Enclave</th></tr></thead>
            <tbody>
              <tr><td><strong>Total Built-Up Area</strong></td><td>3,850 sq.ft</td><td>4,200 sq.ft</td><td>2,400 sq.ft</td></tr>
              <tr><td><strong>Price Per Sq.Ft</strong></td><td>₹4,805 / sq.ft</td><td>₹5,833 / sq.ft</td><td>₹5,833 / sq.ft</td></tr>
              <tr><td><strong>Private Amenities</strong></td><td>Private Pool, Home Theater</td><td>Infinity Lawn, Tennis Court</td><td>Clubhouse, Rooftop Gym</td></tr>
              <tr><td><strong>Title Search Status</strong></td><td>30Y Clear Title Verified</td><td>DTCP Sanctioned</td><td>RERA Registered</td></tr>
              <tr><td><strong>Action</strong></td><td><button class="btn btn-primary btn-sm action-404">Proceed to Token</button></td><td><button class="btn btn-primary btn-sm action-404">Proceed to Token</button></td><td><button class="btn btn-primary btn-sm action-404">Proceed to Token</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- S4 & S5: Document Vault & Price Drop Alerts -->
      <div class="grid-2">
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Encumbrance & Document Vault</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Encumbrance Certificates (Form 15 & 16), parent sale deeds, and tax receipts stored with 256-bit AES encryption.</p>
          <div class="step-timeline">
            <div class="step-timeline-item done"><div class="step-timeline-title">Nil Encumbrance 1994-2026</div><div class="step-timeline-desc">Sub-Registrar Chinna Thirupathi Certified.</div></div>
            <div class="step-timeline-item done"><div class="step-timeline-title">Patta & Chitta Transfer</div><div class="step-timeline-desc">Salem West Taluk Revenue Record verified.</div></div>
          </div>
          <button class="btn btn-outline btn-sm action-404" style="margin-top: 1rem;">Open Document Vault</button>
        </div>
        <div class="feature-card" style="padding: 1.5rem;">
          <h4 style="font-size: 1.05rem;">Active Escrow Hold & Token Status</h4>
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">₹10,00,000 earnest deposit is locked in Axis Bank Escrow for Grand Beverly Hills Manor pending final sale agreement.</p>
          <div class="info-callout" style="margin: 0.75rem 0;">Deposit ID: ESC-2026-991 • Valid until: 15 Oct 2026 • Status: Fully Refundable</div>
          <button class="btn btn-dark btn-sm action-404">Escrow Statement</button>
        </div>
      </div>

      <!-- S6: Asset Maintenance & Tax Dossier -->
      <div class="dash-panel" style="margin-top: 1.5rem;">
        <div class="dash-panel-header"><h3 class="dash-panel-title">Asset Maintenance & Corporation Tax Status</h3></div>
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>Property Name</th><th>Tax Assessment #</th><th>Payment Cycle</th><th>Amount Paid</th><th>Next Due Date</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><strong>Gokulam Estate Villa 4</strong></td><td>SLM-CORP-9102</td><td>Half-Yearly</td><td>₹12,400</td><td>15 Nov 2026</td><td><span class="status-pill status-active">Paid & Cleared</span></td></tr>
              <tr><td><strong>Fairlands Commercial Suite</strong></td><td>SLM-CORP-8812</td><td>Half-Yearly</td><td>₹24,800</td><td>15 Nov 2026</td><td><span class="status-pill status-active">Paid & Cleared</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

/* --------------------------------------------------------------------------
   VIEW 3: CLIENT INQUIRIES & LEADS
   -------------------------------------------------------------------------- */
function renderLeadsView(container, user, role) {
  container.innerHTML = `
    <!-- Quick Actions Toolbar -->
    <div class="quick-actions-bar">
      <span class="quick-actions-label">Leads Management:</span>
      <button class="action-chip action-404">+ Add Inbound Inquiry</button>
      <button class="action-chip action-404">Export CRM Records</button>
      <button class="action-chip action-404">Broadcast WhatsApp Alert</button>
      <button class="action-chip action-404">Schedule Follow-up Call</button>
    </div>

    <!-- S1: Leads & Inquiries KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-info"><h6>Total Pipeline Leads</h6><div class="kpi-number">38 Inquiries</div><div class="kpi-trend positive">↑ 14% This Month</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>High-Intent Buyers</h6><div class="kpi-number">12 High Net Worth</div><div class="kpi-trend positive">Budget > ₹1.5 Cr</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>Avg Broker Response</h6><div class="kpi-number">14 Mins</div><div class="kpi-trend positive">Industry Avg: 4 Hours</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>Conversion Velocity</h6><div class="kpi-number">28.4%</div><div class="kpi-trend positive">Tour to Escrow</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div>
    </div>

    <!-- S2: Active CRM Pipeline Table -->
    <div class="dash-panel">
      <div class="dash-panel-header"><h3 class="dash-panel-title">Active Prospect Stream & Engagement Queue</h3><button class="btn btn-outline btn-sm action-404">Export CSV</button></div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Prospect Entity</th><th>Interested Property</th><th>Allocated Budget</th><th>Source Channel</th><th>Stage</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><strong>Dr. Meenakshi Sundaram</strong></td><td>Grand Beverly Hills Manor</td><td>₹2.00 Cr</td><td>Website Direct</td><td><span class="status-pill status-active">VIP Tour Tomorrow</span></td><td><button class="btn btn-primary btn-sm action-404">Call Client</button></td></tr>
            <tr><td><strong>Arunachalam & Co (NRI London)</strong></td><td>Lakeview Palms Villa</td><td>₹2.50 Cr</td><td>NRI Advisory Desk</td><td><span class="status-pill status-pending">Legal Due Diligence</span></td><td><button class="btn btn-ghost btn-sm action-404">Send Dossier</button></td></tr>
            <tr><td><strong>Senthil Kumar (Salem Industrialist)</strong></td><td>Meyyanur Commercial</td><td>₹3.50 Cr</td><td>Exclusive Referral</td><td><span class="status-pill status-active">Counter-Offer Stage</span></td><td><button class="btn btn-primary btn-sm action-404">Review Offer</button></td></tr>
            <tr><td><strong>Kavitha Natarajan</strong></td><td>Fairlands Modern Enclave</td><td>₹1.50 Cr</td><td>Walk-in Salem HQ</td><td><span class="status-pill status-pending">Initial Showing</span></td><td><button class="btn btn-ghost btn-sm action-404">Schedule Tour</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- S3: Lead Heatmap by Locality -->
    <div class="dash-panel">
      <div class="dash-panel-header"><h3 class="dash-panel-title">Buyer Inquiries by Salem Sub-Markets</h3></div>
      <div class="chart-container">
        <div class="chart-bar-group">
          <div class="chart-bar-value">38%</div>
          <div class="chart-bar" style="height: 180px;"></div>
          <div class="chart-bar-label">Fairlands Enclaves</div>
        </div>
        <div class="chart-bar-group">
          <div class="chart-bar-value">27%</div>
          <div class="chart-bar" style="height: 135px;"></div>
          <div class="chart-bar-label">Hasthampatti Villas</div>
        </div>
        <div class="chart-bar-group">
          <div class="chart-bar-value">21%</div>
          <div class="chart-bar" style="height: 105px;"></div>
          <div class="chart-bar-label">Chinna Thirupathi Plots</div>
        </div>
        <div class="chart-bar-group">
          <div class="chart-bar-value">14%</div>
          <div class="chart-bar" style="height: 70px;"></div>
          <div class="chart-bar-label">Yercaud Foothills</div>
        </div>
      </div>
    </div>

    <!-- S4 & S5: Interaction Log & Negotiation Console -->
    <div class="grid-2">
      <div class="feature-card" style="padding: 1.5rem;">
        <h4 style="font-size: 1.05rem;">Recent Interaction & Consultation Notes</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">Summary of latest calls, site briefings, and WhatsApp correspondence.</p>
        <div class="step-timeline">
          <div class="step-timeline-item done"><div class="step-timeline-title">Call with Dr. Meenakshi (11:00 AM)</div><div class="step-timeline-desc">Confirmed chauffeur pickup at Salem Junction for 11:30 AM tour.</div></div>
          <div class="step-timeline-item done"><div class="step-timeline-title">FEMA Briefing for Arunachalam (09:30 AM)</div><div class="step-timeline-desc">Dispatched 30-year parent deeds and FIRC repatriation guideline.</div></div>
        </div>
        <button class="btn btn-outline btn-sm action-404" style="margin-top: 1rem;">View Full CRM Log</button>
      </div>
      <div class="feature-card" style="padding: 1.5rem;">
        <h4 style="font-size: 1.05rem;">Counter-Offer & Escrow Negotiation</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Automated token deposit escrow requests with verified bank accounts.</p>
        <div class="info-callout" style="margin: 0.75rem 0;">Pending Review: Offer for Green Valley Villa at ₹2.15 Cr (Asking: ₹2.20 Cr)</div>
        <button class="btn btn-dark btn-sm action-404">Launch Negotiation Console</button>
      </div>
    </div>

    <!-- S6: WhatsApp & SMS Automation Queue -->
    <div class="dash-panel" style="margin-top: 1.5rem;">
      <div class="dash-panel-header"><h3 class="dash-panel-title">Automated Client Broadcasts & Notification Queue</h3><button class="btn btn-outline btn-sm action-404">Configure Triggers</button></div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Broadcast Campaign</th><th>Target Audience</th><th>Scheduled Delivery</th><th>Delivery Channel</th><th>Engagement Rate</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td><strong>New Gated Villa Launch in Hasthampatti</strong></td><td>Pre-Qualified Buyers (>₹1.5 Cr)</td><td>Today, 05:00 PM</td><td>WhatsApp + Email</td><td>84% Open Rate</td><td><span class="status-pill status-active">Queued</span></td></tr>
            <tr><td><strong>Fairlands Price Drop Alert (-₹5L)</strong></td><td>Shortlisted Wishlist Users</td><td>Tomorrow, 10:00 AM</td><td>SMS Broadcast</td><td>92% Open Rate</td><td><span class="status-pill status-active">Scheduled</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 4: ANALYTICS & YIELDS
   -------------------------------------------------------------------------- */
function renderAnalyticsView(container, user, role) {
  container.innerHTML = `
    <!-- Quick Actions Toolbar -->
    <div class="quick-actions-bar">
      <span class="quick-actions-label">Market Intelligence:</span>
      <button class="action-chip action-404">Download Salem Market Report</button>
      <button class="action-chip action-404">Yield Sensitivity Matrix</button>
      <button class="action-chip action-404">5-Year Appreciation Model</button>
      <button class="action-chip action-404">Print Locality Index</button>
    </div>

    <!-- S1: Analytics KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-info"><h6>Salem Composite Price Index</h6><div class="kpi-number">₹5,450/sq.ft</div><div class="kpi-trend positive">↑ 8.4% YoY Appreciation</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>Average Gross Rental Yield</h6><div class="kpi-number">7.2% p.a.</div><div class="kpi-trend positive">Top in Tamil Nadu Tier-2</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>Avg Time on Market</h6><div class="kpi-number">28 Days</div><div class="kpi-trend positive">Down from 45 Days in 2025</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>RERA Verified Assets</h6><div class="kpi-number">100%</div><div class="kpi-trend positive">Zero Title Disputes</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div></div>
    </div>

    <!-- S2: Capital Appreciation Neighborhood Forecast -->
    <div class="dash-panel">
      <div class="dash-panel-header"><h3 class="dash-panel-title">Salem 5-Year Capital Appreciation Projections by Neighborhood</h3><button class="btn btn-outline btn-sm action-404">Export Data</button></div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Locality Corridor</th><th>Current Rate (2026)</th><th>3-Yr Projected (2029)</th><th>5-Yr Projected (2031)</th><th>Key Infrastructure Driver</th><th>Growth Confidence</th></tr></thead>
          <tbody>
            <tr><td><strong>Fairlands Luxury Sector</strong></td><td>₹6,850 / sq.ft</td><td>₹8,600 / sq.ft</td><td>₹10,400 / sq.ft</td><td>Salem Metro & Commercial Hub</td><td><span class="status-pill status-active">Very High (9.6/10)</span></td></tr>
            <tr><td><strong>Hasthampatti Residential</strong></td><td>₹5,200 / sq.ft</td><td>₹6,400 / sq.ft</td><td>₹7,750 / sq.ft</td><td>Gated Enclaves & Schools</td><td><span class="status-pill status-active">High (9.1/10)</span></td></tr>
            <tr><td><strong>Chinna Thirupathi IT Corridor</strong></td><td>₹3,950 / sq.ft</td><td>₹5,100 / sq.ft</td><td>₹6,400 / sq.ft</td><td>Tech Park Expansion & Ring Road</td><td><span class="status-pill status-active">Very High (9.4/10)</span></td></tr>
            <tr><td><strong>Meyyanur Commercial</strong></td><td>₹9,400 / sq.ft</td><td>₹11,800 / sq.ft</td><td>₹14,200 / sq.ft</td><td>Corporate Grade-A Office Hub</td><td><span class="status-pill status-active">High (8.9/10)</span></td></tr>
            <tr><td><strong>Yercaud Foothills Sanctuaries</strong></td><td>₹4,100 / sq.ft</td><td>₹4,950 / sq.ft</td><td>₹5,900 / sq.ft</td><td>Luxury Eco-Retreats & Air Purity</td><td><span class="status-pill status-active">Steady (8.5/10)</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- S3: Comparative Rental Yield vs Tier-1 Metros (Restyled Luxury Executive Layout) -->
    <div class="yield-panel-executive">
      <div class="yield-panel-header">
        <div class="yield-panel-title-wrap">
          <h3 class="yield-panel-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary);"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Comparative Luxury Rental Yields (Salem vs Tier-1 Metros)
          </h3>
          <p class="yield-panel-subtitle">Institutional Telemetry &amp; Cap Rate Benchmarking — Q3 2026 Audit</p>
        </div>
        <div class="yield-header-badges">
          <span class="yield-badge-alpha">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Salem Spread: +360 bps Alpha
          </span>
          <button class="btn btn-outline btn-sm action-404" style="color:#ffffff; border-color: rgba(255,255,255,0.25);">Export Model (CSV)</button>
          <button class="btn btn-primary btn-sm action-404">Yield Sensitivity Tool</button>
        </div>
      </div>

      <div class="yield-body">
        <!-- 4-Pillar Executive Yield Metrics -->
        <div class="yield-metrics-grid">
          <div class="yield-metric-box highlight">
            <span class="yield-metric-caption">Salem Prime Yield</span>
            <div class="yield-metric-val">7.8% <span>Gross</span></div>
            <div class="yield-metric-footer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
              Net 7.1% p.a. • Highest in South TN
            </div>
          </div>
          <div class="yield-metric-box">
            <span class="yield-metric-caption">Tier-1 Metro Average</span>
            <div class="yield-metric-val">4.2% <span>Gross</span></div>
            <div class="yield-metric-footer muted">
              Net 3.3% p.a. • Margin Compression
            </div>
          </div>
          <div class="yield-metric-box">
            <span class="yield-metric-caption">Yield Alpha Spread</span>
            <div class="yield-metric-val">+360 <span>bps</span></div>
            <div class="yield-metric-footer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
              +85.7% Higher Cashflow Velocity
            </div>
          </div>
          <div class="yield-metric-box">
            <span class="yield-metric-caption">Price-to-Rent Ratio</span>
            <div class="yield-metric-val">12.8 <span>Yrs</span></div>
            <div class="yield-metric-footer muted">
              Tier-1 Metros Average: 23.8 Yrs
            </div>
          </div>
        </div>

        <!-- Visual Comparative Yield Telemetry Deck -->
        <div class="yield-bars-deck">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
            <h4 style="font-size: 0.9375rem; font-weight: 700; color: var(--color-dark); margin: 0;">Market Realized Gross Yield Benchmarks</h4>
            <span style="font-size: 0.75rem; color: var(--color-text-muted); font-weight: 500;">Indexed against 4BHK Luxury Villas &amp; Penthouse Assets</span>
          </div>

          <!-- Salem -->
          <div class="yield-bar-row">
            <div class="yield-bar-info">
              <div class="yield-bar-location">
                <span>📍 Salem Luxury Enclaves (Fairlands &amp; Chinna Thirupathi)</span>
                <span class="yield-bar-badge-pill badge-top-performer">★ Stackly Outperformer</span>
              </div>
              <div class="yield-bar-nums">
                <span>7.8% Gross</span>
                <span class="yield-bar-net">(Net: 7.1%)</span>
              </div>
            </div>
            <div class="yield-track">
              <div class="yield-fill yield-fill-primary" style="width: 78%;">7.8% p.a.</div>
            </div>
          </div>

          <!-- Coimbatore -->
          <div class="yield-bar-row">
            <div class="yield-bar-info">
              <div class="yield-bar-location">
                <span>📍 Coimbatore Prime (Race Course &amp; Avinashi Rd)</span>
                <span class="yield-bar-badge-pill badge-metro">Regional Tier-2</span>
              </div>
              <div class="yield-bar-nums">
                <span>5.8% Gross</span>
                <span class="yield-bar-net">(Net: 5.1%)</span>
              </div>
            </div>
            <div class="yield-track">
              <div class="yield-fill yield-fill-coimbatore" style="width: 58%;">5.8% p.a.</div>
            </div>
          </div>

          <!-- Hyderabad -->
          <div class="yield-bar-row">
            <div class="yield-bar-info">
              <div class="yield-bar-location">
                <span>📍 Hyderabad IT Corridor (Hitec City &amp; Kokapet)</span>
                <span class="yield-bar-badge-pill badge-metro">Tier-1 IT Hub</span>
              </div>
              <div class="yield-bar-nums">
                <span>4.8% Gross</span>
                <span class="yield-bar-net">(Net: 4.0%)</span>
              </div>
            </div>
            <div class="yield-track">
              <div class="yield-fill yield-fill-hyderabad" style="width: 48%;">4.8% p.a.</div>
            </div>
          </div>

          <!-- Bangalore -->
          <div class="yield-bar-row">
            <div class="yield-bar-info">
              <div class="yield-bar-location">
                <span>📍 Bangalore Prime (Indiranagar &amp; Whitefield)</span>
                <span class="yield-bar-badge-pill badge-metro">Tier-1 Capital</span>
              </div>
              <div class="yield-bar-nums">
                <span>4.2% Gross</span>
                <span class="yield-bar-net">(Net: 3.4%)</span>
              </div>
            </div>
            <div class="yield-track">
              <div class="yield-fill yield-fill-bangalore" style="width: 42%;">4.2% p.a.</div>
            </div>
          </div>

          <!-- Chennai -->
          <div class="yield-bar-row">
            <div class="yield-bar-info">
              <div class="yield-bar-location">
                <span>📍 Chennai Coastal Corridor (ECR &amp; OMR)</span>
                <span class="yield-bar-badge-pill badge-metro">Tier-1 Metro</span>
              </div>
              <div class="yield-bar-nums">
                <span>3.6% Gross</span>
                <span class="yield-bar-net">(Net: 2.9%)</span>
              </div>
            </div>
            <div class="yield-track">
              <div class="yield-fill yield-fill-chennai" style="width: 36%;">3.6% p.a.</div>
            </div>
          </div>

          <!-- Mumbai -->
          <div class="yield-bar-row">
            <div class="yield-bar-info">
              <div class="yield-bar-location">
                <span>📍 Mumbai Ultra-Luxury (Worli &amp; Bandra West)</span>
                <span class="yield-bar-badge-pill badge-metro">Tier-1 High Base</span>
              </div>
              <div class="yield-bar-nums">
                <span>2.8% Gross</span>
                <span class="yield-bar-net">(Net: 2.1%)</span>
              </div>
            </div>
            <div class="yield-track">
              <div class="yield-fill yield-fill-mumbai" style="width: 28%;">2.8% p.a.</div>
            </div>
          </div>
        </div>

        <!-- Comparative Institutional Matrix Table -->
        <div class="yield-table-container">
          <table class="yield-luxury-table">
            <thead>
              <tr>
                <th>Market &amp; Asset Class</th>
                <th>Avg Capital Rate</th>
                <th>Median Monthly Lease (4BHK)</th>
                <th>Gross Yield</th>
                <th>Net Cap Rate</th>
                <th>Payback Horizon</th>
                <th>Stackly Yield Spread</th>
              </tr>
            </thead>
            <tbody>
              <tr class="salem-highlight-row">
                <td><strong>Salem Luxury Enclaves (Stackly Managed)</strong></td>
                <td>₹4,850 - ₹6,850 / sq.ft</td>
                <td>₹95,000 - ₹1,40,000</td>
                <td><strong style="color: #2d5a00;">7.8% p.a.</strong></td>
                <td>7.1%</td>
                <td>12.8 Years</td>
                <td><span class="status-pill status-active" style="background: rgba(146, 200, 0, 0.25); color: #2d5a00;">Benchmark Base</span></td>
              </tr>
              <tr>
                <td><strong>Coimbatore Race Course / Avinashi</strong></td>
                <td>₹7,800 - ₹11,200 / sq.ft</td>
                <td>₹85,000 - ₹1,25,000</td>
                <td>5.8% p.a.</td>
                <td>5.1%</td>
                <td>17.2 Years</td>
                <td>-200 bps</td>
              </tr>
              <tr>
                <td><strong>Hyderabad Gachibowli / Financial District</strong></td>
                <td>₹8,900 - ₹13,500 / sq.ft</td>
                <td>₹1,10,000 - ₹1,65,000</td>
                <td>4.8% p.a.</td>
                <td>4.0%</td>
                <td>20.8 Years</td>
                <td>-300 bps</td>
              </tr>
              <tr>
                <td><strong>Bangalore Indiranagar / Whitefield</strong></td>
                <td>₹13,500 - ₹18,900 / sq.ft</td>
                <td>₹1,20,000 - ₹1,80,000</td>
                <td>4.2% p.a.</td>
                <td>3.4%</td>
                <td>23.8 Years</td>
                <td>-360 bps</td>
              </tr>
              <tr>
                <td><strong>Chennai ECR Corridor</strong></td>
                <td>₹11,500 - ₹16,200 / sq.ft</td>
                <td>₹1,00,000 - ₹1,50,000</td>
                <td>3.6% p.a.</td>
                <td>2.9%</td>
                <td>27.7 Years</td>
                <td>-420 bps</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Strategic Intelligence Callout -->
        <div class="yield-takeaway-card">
          <div class="yield-takeaway-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <div>
            <div class="yield-takeaway-title">Institutional Takeaway: The Salem Yield Advantage</div>
            <p class="yield-takeaway-text">Salem provides institutional investors an unmatched cashflow profile. Because entry land valuations are normalized at ₹3,950–₹6,850/sq.ft while corporate leasing rates from industrial conglomerates, medical tourism heads, and IT executives remain strong, Salem delivers <strong>7.8% gross yield</strong>—delivering over <strong>+360 bps of yield alpha</strong> compared to saturated Tier-1 metros.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- S4 & S5: ROI Calculator & Loan Affordability -->
    <div class="grid-2">
      <div class="feature-card" style="padding: 1.5rem;">
        <h4 style="font-size: 1.05rem;">Investment Sensitivity & Return Estimator</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">Simulate capital growth, rental returns, and tax deductions under Indian IT Act Sec 54.</p>
        <div class="info-callout" style="margin-bottom: 1rem;">₹1.50 Cr Investment @ 8.4% Appreciation + 7% Yield = <strong>₹3.18 Cr Value in 7 Years</strong></div>
        <button class="btn btn-primary btn-sm action-404">Customize Parameters</button>
      </div>
      <div class="feature-card" style="padding: 1.5rem;">
        <h4 style="font-size: 1.05rem;">Mortgage EMI vs Rental Realization</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">With average Salem rental yield of 7.2%, rental income covers up to 82% of standard 20-year home loan EMIs.</p>
        <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width: 82%;"></div></div>
        <p style="font-size: 0.75rem; color: var(--color-primary); font-weight: 600;">82% EMI Offset by Corporate Rental Escrows</p>
        <button class="btn btn-dark btn-sm action-404" style="margin-top: 1rem;">View Mortgage Benchmarks</button>
      </div>
    </div>

    <!-- S6: Historical Transaction Volumes -->
    <div class="dash-panel" style="margin-top: 1.5rem;">
      <div class="dash-panel-header"><h3 class="dash-panel-title">Quarterly Transaction Volume & Value Traded in Salem</h3></div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Quarter Cycle</th><th>Total Luxury Units Traded</th><th>Gross Transaction Value</th><th>Average Ticket Size</th><th>NRI Buyer Share</th></tr></thead>
          <tbody>
            <tr><td><strong>Q1 2026 (Active)</strong></td><td>44 Units</td><td>₹68.4 Cr</td><td>₹1.55 Cr</td><td><span class="status-pill status-active">38% NRI</span></td></tr>
            <tr><td><strong>Q4 2025</strong></td><td>52 Units</td><td>₹79.2 Cr</td><td>₹1.52 Cr</td><td><span class="status-pill status-active">35% NRI</span></td></tr>
            <tr><td><strong>Q3 2025</strong></td><td>39 Units</td><td>₹58.8 Cr</td><td>₹1.50 Cr</td><td><span class="status-pill status-active">31% NRI</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 5: PRIVATE BROKER & ADVISORY DESK
   -------------------------------------------------------------------------- */
function renderAdvisoryView(container, user, role) {
  container.innerHTML = `
    <!-- Quick Actions Toolbar -->
    <div class="quick-actions-bar">
      <span class="quick-actions-label">Advisory Desk:</span>
      <button class="action-chip action-404">Request 30-Year Title Search</button>
      <button class="action-chip action-404">NRI Consular Legal Hotline</button>
      <button class="action-chip action-404">Structural Engineer Audit</button>
      <button class="action-chip action-404">Capital Gains 54EC Consultation</button>
    </div>

    <!-- S1: Advisory Desk KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-info"><h6>Senior Legal Advocates</h6><div class="kpi-number">4 On Retainer</div><div class="kpi-trend positive">Salem Bar Association</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>Title Search Accuracy</h6><div class="kpi-number">100% Purity</div><div class="kpi-trend positive">Zero Litigation Guarantee</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>NRI Remote PoA Deeds</h6><div class="kpi-number">48 Closed</div><div class="kpi-trend positive">USA, UK, Singapore, UAE</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>Escrow Settlement Time</h6><div class="kpi-number">24 Hours</div><div class="kpi-trend positive">Instant Token Clearance</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div></div>
    </div>

    <!-- S2: Senior Legal Counsel Panel -->
    <div class="dash-panel">
      <div class="dash-panel-header"><h3 class="dash-panel-title">Dedicated Salem Legal Advisory Panel</h3><button class="btn btn-outline btn-sm action-404">Book Consultation</button></div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Advocate / Specialist</th><th>Designation</th><th>Bar Council Enrollment</th><th>Specialty Domain</th><th>Availability</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><strong>Adv. K. Sundararajan B.A. B.L.</strong></td><td>Senior Legal Counsel</td><td>MS/1840/1998</td><td>Title Deed Trace & Land Conveyancing</td><td><span class="status-pill status-active">Available Today</span></td><td><button class="btn btn-primary btn-sm action-404">Direct Call</button></td></tr>
            <tr><td><strong>Adv. Priya Meenakshi LL.M.</strong></td><td>RERA Compliance Lead</td><td>TN/2910/2006</td><td>TN RERA Registrations & Builder Arbitration</td><td><span class="status-pill status-active">Available Today</span></td><td><button class="btn btn-primary btn-sm action-404">Direct Call</button></td></tr>
            <tr><td><strong>Adv. S. Vigneshwaran B.L.</strong></td><td>NRI Legal Concierge</td><td>TN/1124/2012</td><td>FEMA, PoA Attestation & Foreign Inward Remittance</td><td><span class="status-pill status-pending">In Consultation</span></td><td><button class="btn btn-ghost btn-sm action-404">Leave Message</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- S3: 6-Step Conveyancing & Title Due Diligence Tracker -->
    <div class="dash-panel">
      <div class="dash-panel-header"><h3 class="dash-panel-title">6-Stage Conveyancing & Clear-Title Verification Workflow</h3></div>
      <div class="step-timeline" style="margin-top: 1rem;">
        <div class="step-timeline-item done"><div class="step-timeline-title">Stage 1: Parent Document Trace (30 Years)</div><div class="step-timeline-desc">All succession deeds, partition agreements, and registered sale deeds from 1994 to present day verified.</div></div>
        <div class="step-timeline-item done"><div class="step-timeline-title">Stage 2: Nil Encumbrance Certificate (EC) Verification</div><div class="step-timeline-desc">Official Nil EC issued by the Sub-Registrar Office, Chinna Thirupathi & Salem West.</div></div>
        <div class="step-timeline-item done"><div class="step-timeline-title">Stage 3: DTCP / Salem Local Planning Authority Sanction</div><div class="step-timeline-desc">Building plan approval, layout sanctions, and road widening clearances checked against municipal records.</div></div>
        <div class="step-timeline-item done"><div class="step-timeline-title">Stage 4: Revenue Records & Patta Transfer Check</div><div class="step-timeline-desc">Computerized Patta, Chitta, and FMB sketch matched with physical boundary coordinates.</div></div>
        <div class="step-timeline-item"><div class="step-timeline-title">Stage 5: Bank Escrow Settlement Configuration</div><div class="step-timeline-desc">Axis Bank and HDFC Bank institutional escrow account ready for token and balance consideration.</div></div>
        <div class="step-timeline-item"><div class="step-timeline-title">Stage 6: Final Sale Deed Registration & Biometric Filing</div><div class="step-timeline-desc">Accompanied Sub-Registrar execution with Stackly senior advocate presence.</div></div>
      </div>
    </div>

    <!-- S4 & S5: NRI Consular & Tax Exemption -->
    <div class="grid-2">
      <div class="feature-card" style="padding: 1.5rem;">
        <h4 style="font-size: 1.05rem;">NRI Repatriation & FEMA Concierge Desk</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">End-to-end guidance for Non-Resident Indians to acquire, hold, or sell properties in Salem without traveling.</p>
        <div class="info-callout" style="margin-bottom: 0.75rem;">FIRC Certificate Assistance • NRE/NRO Bank Account Routing • Consular PoA Attestation</div>
        <button class="btn btn-outline btn-sm action-404">NRI Desk Hotline</button>
      </div>
      <div class="feature-card" style="padding: 1.5rem;">
        <h4 style="font-size: 1.05rem;">Capital Gains Tax Advisory (Section 54/54EC)</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Optimize tax liabilities on real estate transactions through authorized REC/NHAI 54EC capital gains bonds.</p>
        <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width: 100%;"></div></div>
        <p style="font-size: 0.75rem; color: var(--color-primary); font-weight: 600;">100% Tax Exemption Guidance Verified by Chartered Accountants</p>
        <button class="btn btn-dark btn-sm action-404" style="margin-top: 1rem;">Consult CA Panel</button>
      </div>
    </div>

    <!-- S6: Structural Engineering Inspection -->
    <div class="dash-panel" style="margin-top: 1.5rem;">
      <div class="dash-panel-header"><h3 class="dash-panel-title">On-Demand Physical Survey & Structural Engineering Audits</h3><button class="btn btn-outline btn-sm action-404">Book Surveyor</button></div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Audit Package</th><th>Scope of Work</th><th>Turnaround Time</th><th>Deliverables</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><strong>Total Station Boundary DGPS Survey</strong></td><td>Precise satellite coordinate boundary marking</td><td>24 Hours</td><td>Signed Surveyor Map + CAD File</td><td><button class="btn btn-primary btn-sm action-404">Request Audit</button></td></tr>
            <tr><td><strong>Structural Stability & Concrete Core Test</strong></td><td>Rebound hammer test, foundation inspection</td><td>48 Hours</td><td>Government Certified Engineer Report</td><td><button class="btn btn-primary btn-sm action-404">Request Audit</button></td></tr>
            <tr><td><strong>Borewell Water & Soil Bearing Capacity</strong></td><td>Purity test (TDS, Hardness) + SBC test</td><td>72 Hours</td><td>NABL Accredited Lab Dossier</td><td><button class="btn btn-primary btn-sm action-404">Request Audit</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   VIEW 6: ACCOUNT & SECURITY SETTINGS
   -------------------------------------------------------------------------- */
function renderSettingsView(container, user, role) {
  container.innerHTML = `
    <!-- Quick Actions Toolbar -->
    <div class="quick-actions-bar">
      <span class="quick-actions-label">Account Controls:</span>
      <button class="action-chip action-404">Update Profile Details</button>
      <button class="action-chip action-404">Change Password</button>
      <button class="action-chip action-404">Upload Identity Proof</button>
      <button class="action-chip action-404">Manage 2FA Devices</button>
      <button class="action-chip action-404">Delete Account</button>
    </div>

    <!-- S1: Security Health KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-info"><h6>Identity Verification</h6><div class="kpi-number">Level 3</div><div class="kpi-trend positive">Fully Authenticated</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>Two-Factor Auth</h6><div class="kpi-number">Enabled</div><div class="kpi-trend positive">SMS + Authenticator</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>Active Sessions</h6><div class="kpi-number">1 Device</div><div class="kpi-trend positive">Salem IP Secured</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div></div>
      <div class="kpi-card"><div class="kpi-info"><h6>Data Privacy Status</h6><div class="kpi-number">DPDP Act</div><div class="kpi-trend positive">100% Compliant</div></div><div class="kpi-icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div></div>
    </div>

    <!-- S2: Profile Identity Editor -->
    <div class="dash-panel">
      <div class="dash-panel-header"><h3 class="dash-panel-title">Personal Profile & Professional Credentials</h3><button class="btn btn-primary btn-sm action-404">Save Changes</button></div>
      <div class="grid-2" style="margin-top: 1rem;">
        <div class="form-group">
          <label class="form-label">Full Legal Name</label>
          <input type="text" class="form-input" value="${user.firstName || user.username || "Client"} ${user.lastName || ""}" />
        </div>
        <div class="form-group">
          <label class="form-label">Registered Email Address</label>
          <input type="email" class="form-input" value="${user.email || "client@thestackly.com"}" disabled />
        </div>
        <div class="form-group">
          <label class="form-label">Contact Mobile Number</label>
          <input type="tel" class="form-input" value="+91 9876543210" />
        </div>
        <div class="form-group">
          <label class="form-label">Preferred User Role Perspective</label>
          <input type="text" class="form-input" value="${(user.role || currentRole || "Buyer").toUpperCase()}" disabled />
        </div>
      </div>
    </div>

    <!-- S3: KYC Document Vault -->
    <div class="dash-panel">
      <div class="dash-panel-header"><h3 class="dash-panel-title">KYC & Legal Identity Document Vault</h3><button class="btn btn-outline btn-sm action-404">+ Upload Document</button></div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Document Category</th><th>File Name</th><th>Upload Date</th><th>Encryption Standard</th><th>Verification Status</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><strong>Permanent Account Number (PAN)</strong></td><td>PAN_CARD_VERIFIED.pdf</td><td>10 Jan 2026</td><td>AES-256 Bit</td><td><span class="status-pill status-active">Verified (ITD Sync)</span></td><td><button class="btn btn-ghost btn-sm action-404">View File</button></td></tr>
            <tr><td><strong>Aadhaar / National ID</strong></td><td>AADHAAR_MASKED.pdf</td><td>10 Jan 2026</td><td>AES-256 Bit</td><td><span class="status-pill status-active">Verified (UIDAI)</span></td><td><button class="btn btn-ghost btn-sm action-404">View File</button></td></tr>
            <tr><td><strong>Bank Account Mandate</strong></td><td>CANCELLED_CHEQUE.pdf</td><td>15 Jan 2026</td><td>AES-256 Bit</td><td><span class="status-pill status-active">Verified (Penny Drop)</span></td><td><button class="btn btn-ghost btn-sm action-404">View File</button></td></tr>
            <tr><td><strong>RERA / Property Registration</strong></td><td>DEED_PATTA_REGISTRY.pdf</td><td>02 Feb 2026</td><td>AES-256 Bit</td><td><span class="status-pill status-active">Sub-Registrar Cleared</span></td><td><button class="btn btn-ghost btn-sm action-404">View File</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- S4 & S5: Security & Session Log -->
    <div class="grid-2">
      <div class="feature-card" style="padding: 1.5rem;">
        <h4 style="font-size: 1.05rem;">Security & Two-Factor Authentication</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">Protect your property portfolio and financial escrow holds with biometric and SMS OTP authentication.</p>
        <div class="info-callout" style="margin-bottom: 1rem;">Primary 2FA Method: SMS to +91 98***3210 (Backup TOTP Configured)</div>
        <button class="btn btn-outline btn-sm action-404">Configure Security</button>
      </div>
      <div class="feature-card" style="padding: 1.5rem;">
        <h4 style="font-size: 1.05rem;">Emergency Nominee & Successor Delegation</h4>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Authorize an appointed legal nominee to inspect real estate documents in event of emergency.</p>
        <div class="step-timeline">
          <div class="step-timeline-item done"><div class="step-timeline-title">Nominee Appointed</div><div class="step-timeline-desc">Spouse / Legal Heir verified with Aadhaar.</div></div>
        </div>
        <button class="btn btn-dark btn-sm action-404" style="margin-top: 1rem;">Update Nominee</button>
      </div>
    </div>

    <!-- S6: Active Device & Session Telemetry -->
    <div class="dash-panel" style="margin-top: 1.5rem;">
      <div class="dash-panel-header"><h3 class="dash-panel-title">Active Device Logins & Session Security</h3><button class="btn btn-outline btn-sm action-404">Log Out All Other Devices</button></div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Device & Browser</th><th>Location (IP Geo)</th><th>IP Address</th><th>Last Active</th><th>Session State</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><strong>Windows PC • Chrome 132</strong></td><td>Salem, Tamil Nadu, India</td><td>157.49.201.84</td><td>Active Now</td><td><span class="status-pill status-active">Current Session</span></td><td><button class="btn btn-ghost btn-sm action-404" disabled>Current</button></td></tr>
            <tr><td><strong>Apple iPhone 15 Pro • Safari</strong></td><td>Salem, Tamil Nadu, India</td><td>157.49.198.12</td><td>3 Hours Ago</td><td><span class="status-pill status-pending">Idle</span></td><td><button class="btn btn-ghost btn-sm action-404">Revoke</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ==========================================================================
   5. ROLE QUICK SWITCHER
   ========================================================================== */
function initRoleQuickSwitcher(currentUser) {
  const headerSelect = document.getElementById("header-role-select");
  if (headerSelect) {
    headerSelect.value = currentUser.role || "Buyer";
    headerSelect.addEventListener("change", (e) => {
      handleRoleChange(e.target.value);
    });
  }

  let switcher = document.getElementById("role-quick-switcher");
  if (!switcher) {
    switcher = document.createElement("div");
    switcher.id = "role-quick-switcher";
    switcher.className = "role-quick-switcher";
    switcher.innerHTML = `
      <span>View as Role:</span>
      <select id="quick-role-select">
        <option value="Buyer" ${currentUser.role === "Buyer" ? "selected" : ""}>Buyer</option>
        <option value="Seller" ${currentUser.role === "Seller" ? "selected" : ""}>Seller</option>
        <option value="Agent" ${currentUser.role === "Agent" ? "selected" : ""}>Agent</option>
        <option value="Manager" ${currentUser.role === "Manager" ? "selected" : ""}>Manager</option>
        <option value="Admin" ${currentUser.role === "Admin" ? "selected" : ""}>Admin</option>
      </select>
    `;
    document.body.appendChild(switcher);
  }

  const quickSelect = document.getElementById("quick-role-select");
  if (quickSelect) {
    quickSelect.value = currentUser.role || "Buyer";
    quickSelect.addEventListener("change", (e) => {
      handleRoleChange(e.target.value);
    });
  }

  function handleRoleChange(newRole) {
    currentUser.role = newRole;
    currentRole = newRole;
    window.StacklyStore.setCurrentUser(currentUser);
    initHeaderUI(currentUser);
    if (headerSelect) headerSelect.value = newRole;
    if (quickSelect) quickSelect.value = newRole;
    renderSubpage(activeSubpage, currentUser);
    window.showToast(`Switched perspective to: ${newRole}`, "info");
  }
}
