/* ==========================================================================
   STACKLY REAL ESTATE - DASHBOARD CONTROLLER (dashboard.js)
   Role-Adaptive Portal Engine (Admin, Agent, Buyer, Seller, Property Manager)
   Route Guard, Session Management, Real-time CRUD & Charts
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Auth Guard
  const currentUser = window.StacklyStore.getCurrentUser();
  if (!currentUser) {
    window.location.href = "sign-in.html";
    return;
  }

  initDashboardUI(currentUser);
  initNotifications(currentUser);
  initRoleView(currentUser.role || "Customer");
  initRoleQuickSwitcher(currentUser);
  initAddPropertyModal();
});

/* ==========================================================================
   1. DASHBOARD UI HEADER & PROFILE
   ========================================================================== */
function initDashboardUI(user) {
  const greeting = window.getGreetingByTime
    ? window.getGreetingByTime()
    : "Welcome";

  // Set greetings & username
  const greetingEl = document.getElementById("dash-greeting-text");
  if (greetingEl) {
    greetingEl.textContent = `${greeting}, ${user.firstName || user.username || "User"}!`;
  }

  const roleBadgeEls = document.querySelectorAll(".dash-user-role");
  roleBadgeEls.forEach((el) => {
    el.textContent = (user.role || "Customer").toUpperCase();
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

  const lastLoginEl = document.getElementById("dash-last-login");
  if (lastLoginEl) {
    lastLoginEl.textContent = user.lastLogin || new Date().toLocaleString();
  }

  // Sign Out Handler
  const signOutBtns = document.querySelectorAll(".dash-signout-btn");
  signOutBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.StacklyStore.clearCurrentUser();
      window.showToast(
        "You have been safely signed out. See you soon!",
        "info"
      );
      setTimeout(() => {
        window.location.href = "sign-in.html";
      }, 700);
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
   2. NOTIFICATIONS PANEL
   ========================================================================== */
function initNotifications(user) {
  const notifBtn = document.getElementById("dash-notif-btn");
  const notifDropdown = document.getElementById("dash-notif-dropdown");
  const notifList = document.getElementById("dash-notif-list");
  const notifBadge = document.getElementById("dash-notif-badge");

  if (!notifBtn || !notifDropdown) return;

  const notifs = window.StacklyStore.getNotifications();
  if (notifBadge) {
    notifBadge.textContent = notifs.length;
    notifBadge.style.display = notifs.length > 0 ? "flex" : "none";
  }

  if (notifList) {
    notifList.innerHTML = notifs
      .map(
        (n) => `
      <div class="notif-item">
        <strong>${n.title}</strong>
        <p style="margin: 2px 0 0 0; color: var(--color-text-muted);">${n.text}</p>
        <div class="notif-time">${n.time}</div>
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
   3. ROLE-ADAPTIVE VIEWS (Admin, Agent, Buyer, Seller, Manager)
   Requirements: "Role Awareness: Individual dashboard pages for every specific
   role added with relevant content to 4-5 sections in each subpage"
   ========================================================================== */
function initRoleView(role) {
  const viewContainer = document.getElementById("role-dynamic-content");
  if (!viewContainer) return;

  const normalized = role.toLowerCase();

  if (normalized.includes("admin")) {
    renderAdminDashboard(viewContainer);
  } else if (normalized.includes("agent")) {
    renderAgentDashboard(viewContainer);
  } else if (normalized.includes("seller")) {
    renderSellerDashboard(viewContainer);
  } else if (normalized.includes("manager")) {
    renderManagerDashboard(viewContainer);
  } else {
    // Default Buyer / Customer
    renderBuyerDashboard(viewContainer);
  }
}

// 3.1 ADMIN VIEW
function renderAdminDashboard(container) {
  const allProps = window.StacklyStore.getProperties();
  const allUsers = window.StacklyStore.getUsers();
  const allInquiries = window.StacklyStore.getInquiries();

  container.innerHTML = `
    <!-- Section 1: KPI Statistics Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Total Properties</h6>
          <div class="kpi-number">${allProps.length}</div>
          <div class="kpi-trend positive">↑ 12% vs last month</div>
        </div>
        <div class="kpi-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Registered Users</h6>
          <div class="kpi-number">${allUsers.length}</div>
          <div class="kpi-trend positive">↑ 18% new users</div>
        </div>
        <div class="kpi-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Lead Inquiries</h6>
          <div class="kpi-number">${allInquiries.length + 14}</div>
          <div class="kpi-trend positive">↑ 92% response rate</div>
        </div>
        <div class="kpi-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Monthly Volume</h6>
          <div class="kpi-number">₹8.4 Cr</div>
          <div class="kpi-trend positive">↑ 24% gross deal value</div>
        </div>
        <div class="kpi-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </div>
    </div>

    <!-- Section 2: Platform Analytics & Deal Velocity Chart -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <div>
          <h3 class="dash-panel-title">Property Inquiries & Transaction Volume (2026)</h3>
          <p style="font-size: 0.8125rem; color: var(--color-text-muted);">Real-time metrics across Salem, Chennai & Coimbatore</p>
        </div>
        <span class="status-pill status-active">● Live Telemetry</span>
      </div>
      <div class="chart-bar-container">
        <div class="chart-bar-item"><div class="chart-bar-fill" style="height: 45%;"></div><span class="chart-bar-label">Jan</span></div>
        <div class="chart-bar-item"><div class="chart-bar-fill" style="height: 60%;"></div><span class="chart-bar-label">Feb</span></div>
        <div class="chart-bar-item"><div class="chart-bar-fill" style="height: 75%;"></div><span class="chart-bar-label">Mar</span></div>
        <div class="chart-bar-item"><div class="chart-bar-fill" style="height: 55%;"></div><span class="chart-bar-label">Apr</span></div>
        <div class="chart-bar-item"><div class="chart-bar-fill" style="height: 85%;"></div><span class="chart-bar-label">May</span></div>
        <div class="chart-bar-item"><div class="chart-bar-fill" style="height: 95%;"></div><span class="chart-bar-label">Jun</span></div>
      </div>
    </div>

    <!-- Section 3: Registered Users Management -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">Registered Accounts Directory</h3>
        <span style="font-size: 0.875rem; color: var(--color-text-muted);">${allUsers.length} Users Enrolled</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${
              allUsers.length > 0
                ? allUsers
                    .map(
                      (u) => `
              <tr>
                <td><strong>${u.firstName} ${u.lastName}</strong> (${u.username})</td>
                <td>${u.email}</td>
                <td><span class="status-pill status-active">${u.role}</span></td>
                <td>${u.countryCode || "+91"} ${u.phone}</td>
                <td><span class="status-pill status-active">Verified</span></td>
                <td><button class="btn btn-outline btn-sm action-404">Manage</button></td>
              </tr>
            `
                    )
                    .join("")
                : `
              <tr><td colspan="6" style="text-align: center; color: var(--color-text-muted); padding: 2rem;">No other registered users yet. You are currently logged in!</td></tr>
            `
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 4: Property Moderation & Verification Queue -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">Live Properties Moderation Queue</h3>
        <button id="admin-add-prop-btn" class="btn btn-primary btn-sm">+ Add New Listing</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Location</th>
              <th>Price</th>
              <th>RERA Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${allProps
              .slice(0, 5)
              .map(
                (p) => `
              <tr>
                <td><strong>${p.title}</strong></td>
                <td>${p.type}</td>
                <td>${p.city}</td>
                <td style="color: var(--color-dark); font-weight: 700;">${p.priceDisplay}</td>
                <td><span class="status-pill status-active">RERA Verified</span></td>
                <td>
                  <button class="btn btn-ghost btn-sm quick-view-trigger" data-id="${p.id}">Inspect</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 5: System Health & Audit Log -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">System & Security Audit Log</h3>
        <span class="status-pill status-active">Operational</span>
      </div>
      <ul style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.875rem;">
        <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">
          <span>✓ LocalStorage DB integrity verified</span>
          <span style="color: var(--color-text-muted);">Today, 11:20 AM</span>
        </li>
        <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">
          <span>✓ SSL & WCAG AA contrast compliance score: 98%</span>
          <span style="color: var(--color-text-muted);">Today, 10:45 AM</span>
        </li>
        <li style="display: flex; justify-content: space-between;">
          <span>✓ Automated backup routine completed</span>
          <span style="color: var(--color-text-muted);">Yesterday, 11:59 PM</span>
        </li>
      </ul>
    </div>
  `;

  const addBtn = document.getElementById("admin-add-prop-btn");
  if (addBtn) addBtn.addEventListener("click", openAddPropertyModal);
}

// 3.2 AGENT / REALTOR VIEW
function renderAgentDashboard(container) {
  const allProps = window.StacklyStore.getProperties();
  const allInquiries = window.StacklyStore.getInquiries();

  container.innerHTML = `
    <!-- Section 1: Agent KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>My Active Listings</h6>
          <div class="kpi-number">${allProps.length}</div>
          <div class="kpi-trend positive">4 Featured</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Client Leads</h6>
          <div class="kpi-number">${allInquiries.length + 8}</div>
          <div class="kpi-trend positive">↑ 3 new today</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Scheduled Tours</h6>
          <div class="kpi-number">5</div>
          <div class="kpi-trend">Next: Today 3:30 PM</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Commission Accrued</h6>
          <div class="kpi-number">₹4.2 Lakhs</div>
          <div class="kpi-trend positive">Q3 Target: 85% achieved</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9.5a3.5 3.5 0 0 0-7 0c0 2 1.5 3 3.5 3s3.5 1 3.5 3a3.5 3.5 0 0 1-7 0"/></svg></div>
      </div>
    </div>

    <!-- Section 2: Manage My Listed Properties -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <div>
          <h3 class="dash-panel-title">My Portfolio Listings</h3>
          <p style="font-size: 0.8125rem; color: var(--color-text-muted);">Manage your active properties on the Stackly market</p>
        </div>
        <button id="agent-add-prop-btn" class="btn btn-primary btn-sm">+ Publish New Listing</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>City</th>
              <th>Price</th>
              <th>Views</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${allProps
              .map(
                (p) => `
              <tr>
                <td><strong>${p.title}</strong></td>
                <td>${p.city}</td>
                <td style="font-weight: 700;">${p.priceDisplay}</td>
                <td>${Math.floor(Math.random() * 800 + 250)} views</td>
                <td><span class="status-pill ${p.status === "sale" ? "status-active" : "status-pending"}">For ${p.status}</span></td>
                <td>
                  <button class="btn btn-outline btn-sm quick-view-trigger" data-id="${p.id}">View</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 3: Buyer Leads & Inquiries -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">Direct Client Inquiries</h3>
        <span class="status-pill status-active">Active Queue</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Details</th>
              <th>Interested In</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${
              allInquiries.length > 0
                ? allInquiries
                    .map(
                      (inq) => `
              <tr>
                <td><strong>${inq.name}</strong></td>
                <td>${inq.email}<br><small>${inq.phone}</small></td>
                <td>${inq.subject || "Property Inquiry"}</td>
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${inq.message}</td>
                <td><a href="tel:${inq.phone}" class="btn btn-primary btn-sm">Call Back</a></td>
              </tr>
            `
                    )
                    .join("")
                : `
              <tr>
                <td><strong>Meenakshi Sundaram</strong></td>
                <td>meenakshi@gmail.com<br><small>+91 9443218765</small></td>
                <td>The Grand Beverly Villa</td>
                <td>Interested in scheduling an in-person site visit this Saturday.</td>
                <td><a href="tel:+919443218765" class="btn btn-primary btn-sm">Call Back</a></td>
              </tr>
            `
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 4: Upcoming Showing Appointments -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">Upcoming Showing Itinerary</h3>
        <button class="btn btn-outline btn-sm action-404">Sync Google Calendar</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="background: var(--color-bg-light); border-left: 4px solid var(--color-primary); padding: 1rem; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>10:30 AM - Fairlands Modern Residence</strong>
            <p style="font-size: 0.8125rem; color: var(--color-text-muted);">Client: Dr. Rajesh Kumar • Buyer pre-approved</p>
          </div>
          <span class="status-pill status-active">Confirmed</span>
        </div>
        <div style="background: var(--color-bg-light); border-left: 4px solid var(--color-badge-featured); padding: 1rem; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>03:30 PM - Lakeview Palms Waterfront Estate</strong>
            <p style="font-size: 0.8125rem; color: var(--color-text-muted);">Client: Anita Ramanathan • Family site walk</p>
          </div>
          <span class="status-pill status-pending">Pending Reconfirmation</span>
        </div>
      </div>
    </div>
  `;

  const addBtn = document.getElementById("agent-add-prop-btn");
  if (addBtn) addBtn.addEventListener("click", openAddPropertyModal);
}

// 3.3 BUYER / CUSTOMER VIEW
function renderBuyerDashboard(container) {
  const allProps = window.StacklyStore.getProperties();
  const favIds = window.StacklyStore.getFavorites();
  const favProps = allProps.filter((p) => favIds.includes(p.id));

  container.innerHTML = `
    <!-- Section 1: Buyer Overview KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Saved Homes</h6>
          <div class="kpi-number">${favProps.length}</div>
          <div class="kpi-trend positive">Bookmarked</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Booked Site Visits</h6>
          <div class="kpi-number">2</div>
          <div class="kpi-trend positive">1 this Sunday</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Home Loan Eligibility</h6>
          <div class="kpi-number">₹1.50 Cr</div>
          <div class="kpi-trend positive">HDFC Pre-Approved</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9.5a3.5 3.5 0 0 0-7 0c0 2 1.5 3 3.5 3s3.5 1 3.5 3a3.5 3.5 0 0 1-7 0"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Custom Saved Alerts</h6>
          <div class="kpi-number">4</div>
          <div class="kpi-trend">Salem Villas Under ₹2Cr</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>
      </div>
    </div>

    <!-- Section 2: Saved Favorite Properties -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <div>
          <h3 class="dash-panel-title">My Saved Dream Homes</h3>
          <p style="font-size: 0.8125rem; color: var(--color-text-muted);">Quickly review, compare, or schedule tours for your shortlisted residences</p>
        </div>
        <a href="properties.html" class="btn btn-outline btn-sm">Explore More Listings</a>
      </div>
      ${
        favProps.length > 0
          ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          ${favProps
            .map(
              (p) => `
            <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); overflow: hidden;">
              <img src="${p.image}" alt="${p.title}" style="width: 100%; height: 180px; object-fit: cover;">
              <div style="padding: 1.25rem;">
                <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.35rem;">${p.title}</h4>
                <div style="color: var(--color-primary); font-weight: 700; font-size: 1.15rem; margin-bottom: 0.75rem;">${p.priceDisplay}</div>
                <p style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 1rem;">${p.address}, ${p.city}</p>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-primary btn-sm btn-block quick-view-trigger" data-id="${p.id}">View Details</button>
                  <a href="contact.html?property=${encodeURIComponent(p.title)}" class="btn btn-dark btn-sm">Book Visit</a>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <p>You haven't bookmarked any properties yet.</p>
          <a href="properties.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Browse Properties</a>
        </div>
      `
      }
    </div>

    <!-- Section 3: Scheduled Visits & Inspections -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">My Confirmed Property Visits</h3>
        <span class="status-pill status-active">2 Upcoming</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Date & Time</th>
              <th>Assigned Broker</th>
              <th>Broker Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>The Grand Beverly Villa</strong></td>
              <td>Oct 04, 2026 • 11:00 AM</td>
              <td>Karthik Raja</td>
              <td>+91 9876543210</td>
              <td><span class="status-pill status-active">Confirmed</span></td>
            </tr>
            <tr>
              <td><strong>Serene Meadow Residence</strong></td>
              <td>Oct 08, 2026 • 04:30 PM</td>
              <td>Ananya Sharma</td>
              <td>+91 9876543211</td>
              <td><span class="status-pill status-pending">Awaiting Host</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 4: Personalized Recommendations -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">Smart Recommendations for You</h3>
        <span style="font-size: 0.8125rem; color: var(--color-text-muted);">Based on Salem Villa searches</span>
      </div>
      <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 1rem;">
        New properties matching your preference for 4+ BHK villas in Hasthampatti and Fairlands with private parking.
      </p>
      <a href="properties.html?type=Villa&city=Salem" class="btn btn-outline-primary btn-sm">View 4 Matching Villas</a>
    </div>
  `;
}

// 3.4 SELLER VIEW
function renderSellerDashboard(container) {
  const allProps = window.StacklyStore.getProperties();

  container.innerHTML = `
    <!-- Section 1: Seller KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>My Listed Estates</h6>
          <div class="kpi-number">2</div>
          <div class="kpi-trend positive">Active on market</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Total Buyer Impressions</h6>
          <div class="kpi-number">3,840</div>
          <div class="kpi-trend positive">↑ 22% this week</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Active Formal Offers</h6>
          <div class="kpi-number">3</div>
          <div class="kpi-trend positive">Highest: ₹1.82 Cr</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Estimated Market Value</h6>
          <div class="kpi-number">₹3.10 Cr</div>
          <div class="kpi-trend">Stackly AI Valuation</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      </div>
    </div>

    <!-- Section 2: Property Performance Overview -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">My Properties Performance</h3>
        <button id="seller-add-prop-btn" class="btn btn-primary btn-sm">+ List Another Property</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Asking Price</th>
              <th>Views</th>
              <th>Inquiries</th>
              <th>Offers Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>The Grand Beverly Villa</strong><br><small>Hasthampatti, Salem</small></td>
              <td style="font-weight: 700;">₹1.85 Cr</td>
              <td>2,410</td>
              <td>18</td>
              <td>2 Offers</td>
              <td><span class="status-pill status-active">Active</span></td>
            </tr>
            <tr>
              <td><strong>The Orchard Suburban Bungalow</strong><br><small>Chinna Thirupathi, Salem</small></td>
              <td style="font-weight: 700;">₹88 Lakhs</td>
              <td>1,430</td>
              <td>11</td>
              <td>1 Offer</td>
              <td><span class="status-pill status-active">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 3: Buyer Offers & Escrow Status -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">Pending Purchase Offers</h3>
        <span class="status-pill status-pending">Requires Decision</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Property</th>
              <th>Offer Amount</th>
              <th>Financing</th>
              <th>Offer Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Mr. S. Natarajan</strong></td>
              <td>The Grand Beverly Villa</td>
              <td style="color: var(--color-success); font-weight: 700;">₹1.82 Cr</td>
              <td>Cash / Immediate Transfer</td>
              <td>Sep 26, 2026</td>
              <td>
                <button class="btn btn-primary btn-sm action-404">Accept Offer</button>
                <button class="btn btn-outline btn-sm action-404">Counter</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 4: Instant Property Valuation Tool -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">Stackly Free Digital Valuation Engine</h3>
      </div>
      <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
        Get an algorithmically verified price estimation report for any plot, commercial floor, or luxury residence in Salem.
      </p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <input type="text" placeholder="Enter Salem locality / survey number..." class="form-input" style="max-width: 360px;">
        <button class="btn btn-dark btn-sm action-404">Calculate Market Estimate</button>
      </div>
    </div>
  `;

  const addBtn = document.getElementById("seller-add-prop-btn");
  if (addBtn) addBtn.addEventListener("click", openAddPropertyModal);
}

// 3.5 MANAGER VIEW
function renderManagerDashboard(container) {
  container.innerHTML = `
    <!-- Section 1: Property Manager KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Managed Units</h6>
          <div class="kpi-number">48 Units</div>
          <div class="kpi-trend positive">94% Occupied</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Monthly Rent Collected</h6>
          <div class="kpi-number">₹18.5 Lakhs</div>
          <div class="kpi-trend positive">98% collected on time</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9.5a3.5 3.5 0 0 0-7 0c0 2 1.5 3 3.5 3s3.5 1 3.5 3a3.5 3.5 0 0 1-7 0"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Maintenance Tickets</h6>
          <div class="kpi-number">3 Open</div>
          <div class="kpi-trend">All assigned to vendors</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <h6>Leases Expiring Soon</h6>
          <div class="kpi-number">4 Leases</div>
          <div class="kpi-trend">Within next 60 days</div>
        </div>
        <div class="kpi-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div>
      </div>
    </div>

    <!-- Section 2: Tenant Roster & Lease Tracker -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">Active Tenant Roster (Salem Towers & Enclaves)</h3>
        <button class="btn btn-outline btn-sm action-404">Export CSV</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Property Unit</th>
              <th>Monthly Rent</th>
              <th>Lease Ends</th>
              <th>Rent Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Infosys Digital Labs</strong></td>
              <td>Cyber Tower Floor 4</td>
              <td>₹1,80,000</td>
              <td>Dec 31, 2027</td>
              <td><span class="status-pill status-active">Paid</span></td>
              <td><button class="btn btn-ghost btn-sm action-404">Details</button></td>
            </tr>
            <tr>
              <td><strong>Kavitha Murugesan</strong></td>
              <td>Azure Penthouse 18B</td>
              <td>₹85,000</td>
              <td>Mar 31, 2027</td>
              <td><span class="status-pill status-active">Paid</span></td>
              <td><button class="btn btn-ghost btn-sm action-404">Details</button></td>
            </tr>
            <tr>
              <td><strong>Apex Logistics LLP</strong></td>
              <td>Commercial Suite 201</td>
              <td>₹65,000</td>
              <td>Oct 31, 2026</td>
              <td><span class="status-pill status-pending">Due 2 Days</span></td>
              <td><button class="btn btn-ghost btn-sm action-404">Send Reminder</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 3: Maintenance Tickets -->
    <div class="dash-panel">
      <div class="dash-panel-header">
        <h3 class="dash-panel-title">Open Facility & Maintenance Tickets</h3>
        <span class="status-pill status-active">SLA 24 Hours</span>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Property</th>
              <th>Issue Description</th>
              <th>Assigned Vendor</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#TKT-892</td>
              <td>Fairlands Residence</td>
              <td>Solar inverter battery calibration</td>
              <td>Salem Green Energy Corp</td>
              <td><span class="status-pill status-pending">Medium</span></td>
            </tr>
            <tr>
              <td>#TKT-891</td>
              <td>Cyber Tower Salem</td>
              <td>Central HVAC chiller maintenance</td>
              <td>Voltas Commercial Service</td>
              <td><span class="status-pill status-active">Scheduled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ==========================================================================
   4. ROLE QUICK SWITCHER (For Testing & Verification)
   ========================================================================== */
function initRoleQuickSwitcher(currentUser) {
  let switcher = document.getElementById("role-quick-switcher");
  if (!switcher) {
    switcher = document.createElement("div");
    switcher.id = "role-quick-switcher";
    switcher.className = "role-quick-switcher";
    switcher.innerHTML = `
      <span>View as Role:</span>
      <select id="quick-role-select">
        <option value="Admin" ${currentUser.role === "Admin" ? "selected" : ""}>Admin</option>
        <option value="Agent" ${currentUser.role === "Agent" ? "selected" : ""}>Agent</option>
        <option value="Buyer" ${currentUser.role === "Buyer" || currentUser.role === "Customer" ? "selected" : ""}>Buyer</option>
        <option value="Seller" ${currentUser.role === "Seller" ? "selected" : ""}>Seller</option>
        <option value="Manager" ${currentUser.role === "Manager" || currentUser.role === "Property Manager" ? "selected" : ""}>Property Manager</option>
      </select>
    `;
    document.body.appendChild(switcher);
  }

  const select = document.getElementById("quick-role-select");
  if (select) {
    select.addEventListener("change", (e) => {
      const newRole = e.target.value;
      currentUser.role = newRole;
      window.StacklyStore.setCurrentUser(currentUser);
      initDashboardUI(currentUser);
      initRoleView(newRole);
      window.showToast(`Switched dashboard view to: ${newRole}`, "info");
    });
  }
}

/* ==========================================================================
   5. ADD NEW PROPERTY MODAL (CRUD Feature for Admin/Agent/Seller)
   ========================================================================== */
function openAddPropertyModal() {
  let modal = document.getElementById("add-property-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "add-property-modal";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-box" style="padding: 2.25rem;">
      <button class="modal-close-btn" id="close-add-modal">✕</button>
      <h3 style="font-size: 1.5rem; font-weight: 700; color: var(--color-dark); margin-bottom: 0.5rem;">Add New Property Listing</h3>
      <p style="color: var(--color-text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">Fill in property specifications to publish live onto the Stackly portal.</p>
      
      <form id="add-property-form" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Property Title <span class="required">*</span></label>
          <input type="text" id="new-prop-title" class="form-input" placeholder="e.g. Modernist Palm Villa" required>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Type <span class="required">*</span></label>
            <select id="new-prop-type" class="form-select" required>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status <span class="required">*</span></label>
            <select id="new-prop-status" class="form-select" required>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Price Display <span class="required">*</span></label>
            <input type="text" id="new-prop-price-display" class="form-input" placeholder="e.g. ₹1.45 Cr" required>
          </div>
          <div class="form-group">
            <label class="form-label">City <span class="required">*</span></label>
            <select id="new-prop-city" class="form-select" required>
              <option value="Salem">Salem</option>
              <option value="Chennai">Chennai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Locality / Address <span class="required">*</span></label>
          <input type="text" id="new-prop-address" class="form-input" placeholder="e.g. Chinna Thirupathi, Salem" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
          <div class="form-group">
            <label class="form-label">Beds</label>
            <input type="number" id="new-prop-beds" class="form-input" value="4" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Baths</label>
            <input type="number" id="new-prop-baths" class="form-input" value="3" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Area (sqft)</label>
            <input type="number" id="new-prop-sqft" class="form-input" value="3200" min="100">
          </div>
        </div>

        <div style="margin-top: 1rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn btn-outline btn-sm" id="cancel-add-btn">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Publish Listing</button>
        </div>
      </form>
    </div>
  `;

  modal.classList.add("open");

  const close = () => modal.classList.remove("open");
  modal.querySelector("#close-add-modal").addEventListener("click", close);
  modal.querySelector("#cancel-add-btn").addEventListener("click", close);

  const form = modal.querySelector("#add-property-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-prop-title").value.trim();
    const type = document.getElementById("new-prop-type").value;
    const status = document.getElementById("new-prop-status").value;
    const priceDisplay = document
      .getElementById("new-prop-price-display")
      .value.trim();
    const city = document.getElementById("new-prop-city").value;
    const address = document.getElementById("new-prop-address").value.trim();
    const beds = parseInt(document.getElementById("new-prop-beds").value) || 3;
    const baths =
      parseInt(document.getElementById("new-prop-baths").value) || 2;
    const sqft =
      parseInt(document.getElementById("new-prop-sqft").value) || 2500;

    const newProp = {
      id: "prop-" + Date.now(),
      title,
      type,
      status,
      price: 10000000,
      priceDisplay,
      beds,
      baths,
      sqft,
      garage: 2,
      address,
      city,
      image: "assets/images/properties/property-1.webp",
      featured: true,
      agent: {
        name: "Karthik Raja",
        role: "Principal Broker",
        phone: "+91 9876543210",
        avatar: "assets/images/agents/agent-1.webp",
      },
      amenities: [
        "24/7 Security",
        "Solar Power",
        "Modular Kitchen",
        "Car Parking",
      ],
      description:
        "Newly listed premium property in prime residential locality with excellent connectivity and upscale amenities.",
    };

    window.StacklyStore.saveProperty(newProp);
    window.showToast("New property published to live catalogue!", "success");
    close();

    const currentUser = window.StacklyStore.getCurrentUser();
    if (currentUser) {
      initRoleView(currentUser.role || "Customer");
    }
  });
}

function initAddPropertyModal() {
  // Attached dynamically in views
}
